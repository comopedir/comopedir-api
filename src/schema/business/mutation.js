import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';

import BusinessController from '../../controllers/BusinessController';
import { isCreateValid, isUpdateValid, isDeleteValid } from './validate';
import type from './index'

export const createBusinessInputFields = {
  network: {
    description: 'Business network reference (Network ID).',
    type: GraphQLID,
  },
  slug: {
    description: 'Business slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  },
  name: {
    description: 'Business name.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const updateBusinessInputFields = {
  business: {
    description: 'Business ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  field: {
    description: 'Business field to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
  value: {
    description: 'Business value to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

export const deleteBusinessInputFields = {
  business: {
    description: 'Business ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
};

const createBusiness = mutationWithClientMutationId({
  description: 'Create a business.',
  name: 'CreateBusiness',
  inputFields: createBusinessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return BusinessController.create(input);
  },
});

const updateBusiness = mutationWithClientMutationId({
  description: 'Update a business.',
  name: 'UpdateBusiness',
  inputFields: updateBusinessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isUpdateValid(input);
    return BusinessController.update(input, context);
  },
});

const deleteBusiness = mutationWithClientMutationId({
  description: 'Delete a business.',
  name: 'DeleteBusiness',
  inputFields: deleteBusinessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isDeleteValid(input);
    return BusinessController.delete(input, context);
  },
});

export default {
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
