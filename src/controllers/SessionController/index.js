/* eslint-disable no-param-reassign */
import { RateLimiterMemory } from 'rate-limiter-flexible';
import bcrypt from 'bcryptjs';
import auth from '../../services/auth';
import db from '../../services/db';
import logger from '../../services/logger';
import { UnauthorizedError } from '../../errors';

const limiter = new RateLimiterMemory({
  keyPrefix: 'authenticate',
  points: 200, // 6 points
  duration: 60 * 5, // 5 min
});

const SessionController = {
  authenticate: async input => {
    try {
      logger.info('Authentication - Starting...');

      const { phoneNumber, username, email } = input;
      let { role } = input;

      const limiterPhone = await limiter.consume(phoneNumber, 1);
      if (!limiterPhone.remainingPoints)
        throw new Error('Authentication rate limit exceeded.');

      // get account by phoneNumber or email
      const account = await db
        .table('account')
        .where(qb => {
          if (username) {
            qb.where('username', '=', username);
          }

          if (phoneNumber) {
            qb.where('phone_number', '=', phoneNumber);
          }

          if (email) {
            qb.where('email', '=', email);
          }
        })
        .returning('*')
        .then(rows => rows[0]);

      if (!account || !account.password)
        throw new Error('Password, phone or username is invalid.');

      logger.info('Authentication - Compare Password...');
      const isEqual = await bcrypt.compare(input.password, account.password);
      if (!isEqual) throw new Error('Password, phone or username is invalid.');
      logger.info('Authentication - Password - OK');

      const permission = await db
        .table('role')
        .where('account', '=', account.id)
        .where('role', '=', role)
        .returning('*')
        .then(rows => rows[0]);

      if (!permission) throw new UnauthorizedError();

      const person = await db
        .table('person')
        .where('account', '=', account.id)
        .returning('*')
        .then(rows => rows[0]);

      const token = await auth.generateToken({
        account,
        role: permission.role,
      });

      logger.info('Authentication - Success');
      return { token, person, role: permission.role };
    } catch (err) {
      logger.error(err);
      return err;
    }
  },
};
export default SessionController;
