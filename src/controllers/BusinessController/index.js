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
};
export default BusinessController;
