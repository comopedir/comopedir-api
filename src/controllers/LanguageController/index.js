import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';

const LanguageController = {
  getByParam: async (key, value) =>
    db
      .table('language')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('language')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const business = await db
        .table('language')
        .insert({
          iso_code: input.isoCode,
          name: input.name,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { language: { ...language } };
    } catch (err) {
      return err;
    }
  },

  update: async (input, context) => {
    await context.isAuthorized(['admin']);

    try {
      const { language: languageId, field, value } = input;

      let updateField;
      updateField = '';

      let language = await LanguageController.getByParam('id', fromGlobalId(languageId).id);
      if (!language) throw new Error('Language does not exist.');

      const updatePayload = {};

      switch (field) {
        case 'isoCode':
          updateField = 'iso_code';
          updatePayload[updateField] = value;
          break;
        case 'name':
          updateField = 'name';
          updatePayload[updateField] = value;
        default:
          throw new Error('Access denied.');
      }

      language = await db
        .table('language')
        .update(updatePayload)
        .where({ id: language.id })
        .returning('*')
        .then(rows => rows[0]);

       return { language: { ...language } };
    } catch (err) {
      console.error(err);
      throw new Error('Error updating language data.');
    }
  },

  delete: async (input, context) => {
    const trx = await db.transaction();

    await context.isAuthorized(['admin']);

    try {
      const { language: languageId } = input;

      let language = await LanguageController.getByParamWithTransaction(
        'id', 
        fromGlobalId(languageId).id,
        trx
      );
      if (!language) throw new Error('Language does not exist.');

      await db
        .table('language')
        .transacting(trx)
        .where({ langugage: language.id })
        .del();

      await trx.commit();

      return { language: { ...language } };
    } catch (err) {
      await trx.rollback();
      console.error(err);
      throw new Error('Error deleting business.');
    }
  },
};
export default LanguageController;
