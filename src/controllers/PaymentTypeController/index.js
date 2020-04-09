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
  associate: async (input) => {
    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParam(
          'id', 
          fromGlobalId(input.business).id
        );
      }

      if (!business) throw new Error('Business not found.');

      let paymentType;

      if (input.paymentType) {
        paymentType = await PaymentTypeController.getByParam(
          'id', 
          fromGlobalId(input.paymentType).id
        );        
      }

      if (!paymentType) throw new Error('Payment type not found.');
      
      await db
        .table('business_payment_type')
        .where({
          business: business.id,
          payment_type: paymentType.id,
        })
        .del();

      const businessPaymentType = await db
        .table('business_payment_type')
        .insert({
          business: business.id,
          payment_type: paymentType.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { businessPaymentType: { ...businessPaymentType } };
    } catch (err) {
      return err;
    }
  },
};
export default PaymentTypeController;
