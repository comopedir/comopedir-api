import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';

import BusinessController from '../../controllers/BusinessController';
import { isCreateValid, isUpdateValid } from './validate';
import type from './index'

export const createBusinessInputFields = {
  network: { type: GraphQLString },
  slug: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
};

export const updateBusinessInputFields = {
  businessId: { type: new GraphQLNonNull(GraphQLString) },
  field: { type: new GraphQLNonNull(GraphQLString) },
  value: { type: new GraphQLNonNull(GraphQLString) },
};

const createBusiness = mutationWithClientMutationId({
  name: 'CreateBusiness',
  inputFields: createBusinessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return BusinessController.create(input);
  },
});

const updateBusiness = mutationWithClientMutationId({
  name: 'UpdateBusiness',
  inputFields: updateBusinessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, context) => {
    // context.isAuthorized(['admin']);
    await isUpdateValid(input);
    return BusinessController.update(input, context);
  },
});

export default {
  createBusiness,
  updateBusiness,
};
