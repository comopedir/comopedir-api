import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import TranslationController from '../../controllers/TranslationController';

import { isCreateCategoryValid, isDeleteValid, isUpdateValid } from './validate';
import TranslationType from './index';

export const categoryTranslationInputFields = {
  language: {
    description: 'Translation language ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  category: {
    description: 'Translation category ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  name: {
    description: 'Translation name.',
    type: new GraphQLNonNull(GraphQLString),
  },
  description: {
    description: 'Translation description.',
    type: GraphQLString,
  },
};

const createCategoryTranslation = mutationWithClientMutationId({
  description: 'Create a translation for a category.',
  name: 'CreateCategoryTranslation',
  inputFields: categoryTranslationInputFields,
  outputFields: { translation: { type: TranslationType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateCategoryValid(input);
    return TranslationController.createCategoryTranslation(input);
  },
});

export const deleteTranslationInputFields = {
  language: {
    description: 'Translation ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
};

export const updateTranslationInputFields = {
  translation: {
    description: 'Translation ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  name: {
    description: 'Translation name.',
    type: new GraphQLNonNull(GraphQLString),
  },
  description: {
    description: 'Translation description.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const updateTranslation = mutationWithClientMutationId({
  description: 'Update a translation.',
  name: 'UpdateTranslation',
  inputFields: updateTranslationInputFields,
  outputFields: { translation: { type: TranslationType } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isUpdateValid(input);
    return TranslationController.update(input, context);
  },
});

const deleteTranslation = mutationWithClientMutationId({
  description: 'Delete a translation.',
  name: 'DeleteTranslation',
  inputFields: deleteTranslationInputFields,
  outputFields: { translation: { type: TranslationType } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isDeleteValid(input);
    return TranslationController.delete(input, context);
  },
});

export default {
  createCategoryTranslation,
  updateTranslation,
  deleteTranslation,
};