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

      let service;

      if (input.service) {
        service = await ServiceController.getByParam(
          'id', 
          fromGlobalId(input.service).id
        );        
      }

      if (!service) throw new Error('Service not found.');
      
      await db
        .table('business_service')
        .where({
          business: business.id,
          service: service.id,
        })
        .del();

      const businessService = await db
        .table('business_service')
        .insert({
          business: business.id,
          service: service.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { businessService: { ...businessService } };
    } catch (err) {
      return err;
    }
  },
};
export default ServiceController;
