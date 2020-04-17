import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';

import BusinessController from '../BusinessController';

const AddressController = {
  getByParam: async (key, value) =>
    db
      .table('address')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input, TransactionDB) => {
    const trx = TransactionDB || (await db.transaction());

    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParamWithTransaction(
          'id', 
          fromGlobalId(input.business).id,
          trx,
        );
      }

      if (!business) {
        throw new Error('Business not found.')
      }

      await db
        .table('address')
        .where('business', business.id)
        .transacting(trx)
        .update({ current: false });

      const address = await db
        .table('address')
        .transacting(trx)
        .insert({
          business: business.id,
          street: input.street,
          street_number: input.streetNumber,
          complement: input.complement,
          district: input.district,
          city: input.city,
          state: input.state,
          zip_code: input.zipCode,
          country: input.country,
          latitude: input.latitude,
          longitude: input.longitude,
        })
        .returning('*')
        .then(rows => rows[0]);

      if (!TransactionDB) await trx.commit();

      return { address: { ...address } };
    } catch (err) {
      console.error(err);
      trx.rollback();
      return err;
    }
  },
};
export default AddressController;
