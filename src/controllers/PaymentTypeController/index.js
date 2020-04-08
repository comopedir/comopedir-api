import db from '../../services/db';

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
};
export default PaymentTypeController;
