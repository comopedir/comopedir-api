import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import NetworkController from '../NetworkController'

const BusinessController = {
  getByParam: async (key, value) =>
    db
      .table('business')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('business')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      let network;

      if (input.network) {
        network = await NetworkController.getByParam(
          'id', 
          fromGlobalId(input.network).id
        );
      }
 
      const business = await db
        .table('business')
        .insert({
          network: network ? network.id : null,
          slug: input.slug,
          name: input.name,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { business: { ...business } };
    } catch (err) {
      return err;
    }
  },
  update: async (input, context) => {
    await context.isAuthorized(['admin']);

    try {
      const { business: businessId, field, value } = input;
      const dbBusinessId = fromGlobalId(businessId).id;

      let updateField;

      updateField = '';

      let business = await BusinessController.getByParam('id', dbBusinessId);
      if (!business) throw new Error('Business does not exist.');

      const updatePayload = {};

      switch (field) {
        case 'slug':
          updateField = 'slug';
          updatePayload[updateField] = value;
          break;
        case 'name':
          updateField = 'name';
          updatePayload[updateField] = value;
        case 'network':
          updateField = 'network';
          if (value) {
            updatePayload[updateField] = fromGlobalId(value).id;
          } else {
            updatePayload[updateField] = null;
          }
          
          break;
        default:
          throw new Error('Access denied.');
      }

      updatePayload['updated_at'] = new Date().toUTCString();

      business = await db
        .table('business')
        .update(updatePayload)
        .where({ id: business.id })
        .returning('*')
        .then(rows => rows[0]);

      return { business };
    } catch (err) {
      console.error(err);
      throw new Error('Error updating business data.');
    }
  },
};
export default BusinessController;
