/* eslint-disable no-param-reassign */
import { RateLimiterMemory } from 'rate-limiter-flexible';
import bcrypt from 'bcryptjs';
import { toGlobalId } from 'graphql-relay';
import logger from '../../services/logger';
import auth from '../../services/auth';
import db from '../../services/db';
import sms from '../../services/sms';
import generateCode from '../../utils/generateCode';

const smsLimiter = new RateLimiterMemory({
  keyPrefix: 'sms',
  points: 5, // 6 points
  duration: 60 * 5, // 4 min
});

const smsActiveLimiter = new RateLimiterMemory({
  keyPrefix: 'sms',
  points: 5, // 6 points
  duration: 60 * 5, // 4 min
});

const AccountController = {
  getByPhone: async ({ phoneCountryCode, phoneAreaCode, phoneNumber }) =>
    db
      .table('account')
      .where({
        phone_number: phoneNumber,
        phone_country_code: phoneCountryCode,
        phone_area_code: phoneAreaCode,
      })
      .returning('*')
      .then(rows => rows[0]),

  getByParam: async (key, value) =>
    db
      .table('account')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  createFromPhoneNumber: async ({ input, TransactionDB }) => {
    const trx = TransactionDB || (await db.transaction());

    try {
      logger.info('Account - Creating...');

      let account = await AccountController.getByPhone(input);

      if (account) {
        const user = await AccountController.sendCodeFromPhoneNumber(input);
        return user;
      }

      logger.info('Account - SMS Code generation...');
      const code = generateCode(6, { type: 'number' });
      logger.info('Account - SMS code generation OK.');

      account = await db
        .table('account')
        .transacting(trx)
        .insert({
          phone_number: input.phoneNumber,
          phone_country_code: input.phoneCountryCode,
          phone_area_code: input.phoneAreaCode,
          email: input.email,
          username: input.username || null,
          status,
          code,
        })
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ])
        .then(rows => rows[0]);


      logger.info('Account - Sending SMS Code...');
      const response = await sms.send({
        to: phoneComplete(input),
        body: `${code} - Seu código de acesso no Como Pedir.`,
      });
      logger.info('Account - Sending SMS Code - Success', {
        phoneComplete: phoneComplete(input),
        response,
      });

      if (!TransactionDB) await trx.commit();
      logger.info('Account - Success!');
      return account;
    } catch (err) {
      trx.rollback();
      logger.error(err);
      return err;
    }
  },

  createFromPerson: async ({ input, TransactionDB }) => {
    const trx = TransactionDB || (await db.transaction());

    try {
      logger.info('Account - Creating...');

      const account = await db
        .table('account')
        .transacting(trx)
        .insert({
          username:  input.username || null,
          email: input.email,
          password: await bcrypt.hash(input.password, 8),
          status: 'active',
        })
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ])
        .then(rows => rows[0]);

      if (!TransactionDB) await trx.commit();
      logger.info('Account - Success!');
      return account;
    } catch (err) {
      trx.rollback();
      logger.error(err);
      return err;
    }
  },

  activateFromPhoneNumber: async input => {
    try {
      const limiterIp = await smsActiveLimiter.consume(AccountController.formatPhone(input), 1);
      if (!limiterIp.remainingPoints) throw new Error('SMS rate limit exceeded.');

      let account = await db
        .table('account')
        .where({
          phone_number: input.phoneNumber,
          phone_country_code: input.phoneCountryCode,
          phone_area_code: input.phoneAreaCode,
        })
        .where('code', '=', input.code)
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ])
        .then(rows => rows[0]);

      if (!account) throw new Error('Code or Phone Number invalid.');

      account = await db
        .table('account')
        .where('id', '=', account.id)
        .update({
          status: 'active',
        })
        .returning(['id'])
        .then(rows => rows[0]);

      const token = await auth.generateToken({
        account,
        role: 'user',
      });

      return { token };
    } catch (err) {
      return err;
    }
  },

  resendCodeFromPhoneNumber: async input => {
    try {
      const limiterPhone = await smsLimiter.consume(AccountController.formatPhone(input), 1);
      if (!limiterPhone.remainingPoints) throw new Error('SMS rate limit exceeded.');

      let account = await db
        .table('account')
        .where({
          phone_number: input.phoneNumber,
          phone_country_code: input.phoneCountryCode,
          phone_area_code: input.phoneAreaCode,
        })
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ]);

      if (!account) throw new Error('Account not found.');

      const code = generateCode(6, { type: 'number' });

      account = await db
        .table('account')
        .where({
          phone_number: input.phoneNumber,
          phone_country_code: input.phoneCountryCode,
          phone_area_code: input.phoneAreaCode,
        })
        .update({
          code,
        })
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ])
        .then(rows => rows[0]);

      await sms.send({
        to: phoneComplete(input),
        body: `${code} - Seu código de acesso no Como Pedir.`,
      });

      return { ...account, id: toGlobalId(account.id) };
    } catch (err) {
      return err;
    }
  },

  sendCodeFromPhoneNumber: async input => {
    try {
      const code = generateCode(6, { type: 'number' });

      // update account with new code
      const account = await db
        .table('account')
        .where({
          phone_number: input.phoneNumber,
          phone_country_code: input.phoneCountryCode,
          phone_area_code: input.phoneAreaCode,
        })
        .update({
          code,
        })
        .returning([
          'id',
          'phone_number',
          'phone_area_code',
          'phone_country_code',
          'email',
          'status',
          'created_at',
          'updated_at',
        ])
        .then(rows => rows[0]);

      // send new sms code
      await sms.send({
        to: AccountController.formatPhone(input),
        body: `${code} - Seu código de acesso no Como Pedir.`,
      });

      return { ...account, id: toGlobalId(account.id) };
    } catch (err) {
      return err;
    }
  },

  formatPhone : ({ phoneCountryCode, phoneAreaCode, phoneNumber }) =>
    `+${phoneCountryCode}${phoneAreaCode}${phoneNumber}`,
};
export default AccountController;
