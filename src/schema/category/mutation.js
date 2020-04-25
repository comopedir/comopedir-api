import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import CategoryController from '../../controllers/CategoryController';

import { isCreateValid, isAssociateValid } from './validate';
import CategoryType from './index';
import BusinessCategoryType from '../businessCategory';

export const categoryInputFields = {
  slug: {
    description: 'Category slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  },
  priority: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Category priority.',
  },
};

const createCategory = mutationWithClientMutationId({
  description: 'Create a category.',
  name: 'CreateCategory',
  inputFields: categoryInputFields,
  outputFields: { category: { type: CategoryType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return CategoryController.create(input);
  },
});

export const associateCategoriesInputFields = {
  business: {
    description: 'Related business ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  categories: {
    description: 'Related categories ID list.',
    type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
  },
};

const associateCategories = mutationWithClientMutationId({
  description: 'Associate a category with a business.',
  name: 'AssociateCategories',
  inputFields: associateCategoriesInputFields,
  outputFields: { businessCategory: { type: BusinessCategoryType } },
  mutateAndGetPayload: async (input, _context) => {   
    await isAssociateValid(input);
    return CategoryController.associate(input);
  },
});

export default {
  createCategory,
  associateCategories,
};
