import { mutationWithClientMutationId } from 'graphql-relay';
import BusinessController from '../../controllers/BusinessController';

import type, { inputFields } from './index';
import isValid from './validate';

const createBusiness = mutationWithClientMutationId({
  name: 'CreateBusiness',
  inputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, context) => {
    await isValid(input);
    return BusinessController.create(input);
  },
});

export default {
  createBusiness,
};
