import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';

import LanguageController from '../LanguageController';
import CategoryController from '../CategoryController';

const TranslationController = {
  getByParam: async (key, value) =>
    db
      .table('translation')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('translation')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  createCategoryTranslation: async (input) => {
    const trx = await db.transaction();

    const {
      language: languageId,
      category: categoryId,
      name,
      description
    } = input;

    let language = await LanguageController.getByParamWithTransaction(
      'id', 
      fromGlobalId(languageId).id,
      trx
    );
    if (!language) throw new Error('Language does not exist.');

    let category = await CategoryController.getByParamWithTransaction(
      'id', 
      fromGlobalId(categoryId).id,
      trx
    );
    if (!category) throw new Error('Category does not exist.');

    try {
      const translation = await db
        .table('translation')
        .transacting(trx)
        .insert({
          language: language.id,
          name,
          description,
        })
        .returning('*')
        .then(rows => rows[0]);

      await db
        .table('category_translation')
        .transacting(trx)
        .insert({
          category: category.id,
          translation: translation.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      await trx.commit();

      return { translation: { ...translation } };
    } catch (err) {
      await trx.rollback();
      return err;
    }
  },

  update: async (input) => {
    const trx = await db.transaction();

    const {
      translation: translationId,
      name,
      description
    } = input;

    let translation = await TranslationController.getByParamWithTransaction(
      'id', 
      fromGlobalId(translationId).id,
      trx
    );
    if (!translation) throw new Error('Translation does not exist.');

    try {
      translation = await db
        .table('translation')
        .update({
          name,
          description
        })
        .where({ id: translation.id })
        .returning('*')
        .then(rows => rows[0]);

      await trx.commit();

      return { translation: { ...translation } };
    } catch (err) {
      await trx.rollback();
      return err;
    }
  },

  delete: async (input, context) => {
    const trx = await db.transaction();

    await context.isAuthorized(['admin']);

    try {
      const { language: languageId } = input;

      let language = await TranslationController.getByParamWithTransaction(
        'id', 
        fromGlobalId(languageId).id,
        trx
      );
      if (!language) throw new Error('Language does not exist.');

      await db
        .table('language')
        .transacting(trx)
        .where({ id: language.id })
        .del();

      await trx.commit();

      return { language: { ...language } };
    } catch (err) {
      await trx.rollback();
      console.error(err);
      throw new Error('Error deleting language.');
    }
  },
};

export default TranslationController;
