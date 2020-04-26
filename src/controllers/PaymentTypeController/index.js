import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import BusinessController from '../BusinessController';

const PaymentTypeController = {
  getByParam: async (key, value) =>
    db
      .table('payment_type')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('payment_type')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const paymentType = await db
        .table('payment_type')
        .insert({
          slug: input.slug,
          priority: input.priority,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { paymentType: { ...paymentType } };
    } catch (err) {
      return err;
    }
  },

  associatePaymentType: async (business, paymentTypeId, trx) => {
    try {
      const paymentType = await PaymentTypeController.getByParamWithTransaction(
        'id', 
        fromGlobalId(paymentTypeId).id,
        trx,
      );

      if (!paymentType) throw new Error('Payment type not found.');

      await db
        .table('business_payment_type')
        .transacting(trx)
        .insert({
          business: business.id,
          payment_type: paymentType.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return Promise.resolve('ok');
    }
    catch (err) {
      console.error('Problem associating business / payment type.');
    }
  },

  associate: async (input) => {
    const trx = await db.transaction();
    
    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParam(
          'id', 
          fromGlobalId(input.business).id
        );
      }

      if (!business) throw new Error('Business not found.');
      if (!input.paymentTypes) throw new Error('Payment type not found.');

      await db
        .table('business_payment_type')
        .transacting(trx)
        .where({
          business: business.id,
        })
        .del();

      await Promise.all(
        input.paymentTypes.map(
          paymentTypeId => PaymentTypeController.associatePaymentType(business, paymentTypeId, trx)
        )
      );

      const businessPaymentType = await db
        .table('business_payment_type')
        .transacting(trx)
        .where({
          business: business.id,
        });

      await trx.commit();

      return { businessPaymentType: { ...businessPaymentType } };
    } catch (err) {
      return err;
    }
  },
};
export default PaymentTypeController;
