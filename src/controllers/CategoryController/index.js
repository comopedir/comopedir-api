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
  
  associateCategory: async (business, categoryId, trx) => {
    try {
      const category = await CategoryController.getByParamWithTransaction(
        'id', 
        fromGlobalId(categoryId).id,
        trx,
      );

      if (!category) throw new Error('Category not found.');

      await db
        .table('business_category')
        .transacting(trx)
        .insert({
          business: business.id,
          category: category.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      return Promise.resolve('ok');
    }
    catch (err) {
      console.error('Problem associating business / category.');
    }
  },

  associate: async (input) => {
    const trx = await db.transaction();

    try {      
      let business;

      if (input.business) {
        business = await BusinessController.getByParamWithTransaction(
          'id', 
          fromGlobalId(input.business).id,
          trx
        );
      }

      if (!business) throw new Error('Business not found.');
      if (!input.categories) throw new Error('Categories not found.');

      await db
        .table('business_category')
        .transacting(trx)
        .where({
          business: business.id,
        })
        .del();

      await Promise.all(
        input.categories.map(
          categoryId => CategoryController.associateCategory(business, categoryId, trx)
        )
      );

      const businessCategory = await db
        .table('business_category')
        .transacting(trx)
        .where({
          business: business.id,
        });

      await trx.commit();

      return { businessCategory: { ...businessCategory } };
    } catch (err) {
      await trx.rollback();
      return err;
    }
  },

  update: async (input, context) => {
    await context.isAuthorized(['admin']);

    try {
      const { category: categoryId, field, value } = input;

      let updateField;
      updateField = '';

      let category = await CategoryController.getByParam(
        'id',
        fromGlobalId(categoryId).id,
      );
      
      if (!category) throw new Error('Category does not exist.');

      const updatePayload = {};

      switch (field) {
        case 'slug':
          updateField = 'slug';
          updatePayload[updateField] = value;
          break;
        case 'priority':
          updateField = 'priority';
          updatePayload[updateField] = value;
          break;
        default:
          throw new Error('Access denied.');
      }

      category = await db
        .table('category')
        .update(updatePayload)
        .where({ id: category.id })
        .returning('*')
        .then(rows => rows[0]);

      return { category: { ...category } };
    } catch (err) {
      console.error(err);
      throw new Error('Error updating category data.');
    }
  },
};
export default CategoryController;
