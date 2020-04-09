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

  create: async (input) => {
    try {

      let business;

      if (input.business) {
        business = await BusinessController.getByParam(
          'id', 
          fromGlobalId(input.business).id
        );
      }

      if (!business) {
        throw new Error('Business not found.')
      }

      await db
        .table('address')
        .where('business', business.id)
        .update({ current: false });

      const address = await db
        .table('address')
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

      return { address: { ...address } };
    } catch (err) {
      return err;
    }
  },
};
export default AddressController;
