import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import CategoryController from '../../controllers/CategoryController';

import isValid from './validate';
import type from './index'

export const categoryInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createCategory = mutationWithClientMutationId({
  name: 'CreateCategory',
  inputFields: categoryInputFields,
  outputFields: { category: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return CategoryController.create(input);
  },
});

export default {
  createCategory,
};
