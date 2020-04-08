import { mutationWithClientMutationId } from 'graphql-relay';
import CategoryController from '../../controllers/CategoryController';

import type, { inputFields } from './index';
import isValid from './validate';

const createCategory = mutationWithClientMutationId({
  name: 'CreateCategory',
  inputFields,
  outputFields: { category: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return CategoryController.create(input);
  },
});

export default {
  createCategory,
};
