import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import BusinessController from '../BusinessController';

const CategoryController = {
  getByParam: async (key, value) =>
    db
      .table('category')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
  db
    .table('category')
    .transacting(TransactionDB)
    .where(key, '=', value)
    .returning('*')
    .then(rows => rows[0]),

  create: async (input) => {
    try {
      const category = await db
        .table('category')
        .insert({
          slug: input.slug,
          priority: input.priority,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { category: { ...category } };
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

      let category;

      if (input.category) {
        category = await CategoryController.getByParam(
          'id', 
          fromGlobalId(input.category).id
        );        
      }

      if (!category) throw new Error('Category not found.');
      
      await db
        .table('business_category')
        .where({
          business: business.id,
          category: category.id,
        })
        .del();

      const businessCategory = await db
        .table('business_category')
        .insert({
          business: business.id,
          category: category.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { businessCategory: { ...businessCategory } };
    } catch (err) {
      return err;
    }
  },
};
export default CategoryController;
