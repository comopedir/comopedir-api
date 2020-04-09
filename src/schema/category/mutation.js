import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import CategoryController from '../../controllers/CategoryController';

import { isCreateValid, isAssociateValid } from './validate';
import CategoryType from './index';
import BusinessCategoryType from '../businessCategory';

export const categoryInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createCategory = mutationWithClientMutationId({
  name: 'CreateCategory',
  inputFields: categoryInputFields,
  outputFields: { category: { type: CategoryType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return CategoryController.create(input);
  },
});

export const associateCategoryInputFields = {
  business: { type: new GraphQLNonNull(GraphQLString) },
  category: { type: new GraphQLNonNull(GraphQLString) },
};

const associateCategory = mutationWithClientMutationId({
  name: 'AssociateCategory',
  inputFields: associateCategoryInputFields,
  outputFields: { businessCategory: { type: BusinessCategoryType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return CategoryController.associate(input);
  },
});

export default {
  createCategory,
  associateCategory,
};
