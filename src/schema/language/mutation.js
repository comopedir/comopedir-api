import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import LanguageController from '../../controllers/LanguageController';

import { isCreateValid, isUpdateValid } from './validate';
import LanguageType from './index';

export const languageInputFields = {
  isoCode: {
    description: 'Language iso code.',
    type: new GraphQLNonNull(GraphQLString),
  },
  priority: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Language priority.',
  },
};

const createLanguage = mutationWithClientMutationId({
  description: 'Create a language.',
  name: 'CreateLanguage',
  inputFields: languageInputFields,
  outputFields: { language: { type: LanguageType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return LanguageController.create(input);
  },
});

export const updateLanguageInputFields = {
  language: {
    description: 'Language ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  field: {
    description: 'Category field to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
  value: {
    description: 'Category value to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const updateLanguage = mutationWithClientMutationId({
  description: 'Update a language.',
  name: 'UpdateLanguage',
  inputFields: updateLanguageInputFields,
  outputFields: { language: { type: LanguageType } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isUpdateValid(input);
    return LanguageController.update(input, context);
  },
});

export default {
  createLanguage,
  updateLanguage,
};
