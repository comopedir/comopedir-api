import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import BusinessController from '../BusinessController';

const ServiceController = {
  getByParam: async (key, value) =>
    db
      .table('service')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('service')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const service = await db
        .table('service')
        .insert({
          slug: input.slug,
          priority: input.priority,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { service: { ...service } };
    } catch (err) {
      return err;
    }
  },

  associateService: async (business, serviceId, trx) => {
    try {
      const service = await ServiceController.getByParamWithTransaction(
        'id', 
        fromGlobalId(serviceId).id,
        trx,
      );

      if (!service) throw new Error('Service not found.');

      await db
        .table('business_service')
        .transacting(trx)
        .insert({
          business: business.id,
          service: service.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return Promise.resolve('ok');
    }
    catch (err) {
      console.error('Problem associating service / category.');
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
      if (!input.services) throw new Error('Services not found.');
      if (input.services.length === 0) throw new Error('Services not found.');

      await db
        .table('business_service')
        .transacting(trx)
        .where({
          business: business.id,
        })
        .del();

      await Promise.all(
        input.services.map(
          serviceId => ServiceController.associateService(business, serviceId, trx)
        )
      );

      const businessService = await db
        .table('business_service')
        .transacting(trx)
        .where({
          business: business.id,
        });

      await trx.commit();

      return { businessService: { ...businessService } };
    } catch (err) {
      return err;
    }
  },
};
export default ServiceController;
