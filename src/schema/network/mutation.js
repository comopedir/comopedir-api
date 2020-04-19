import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import NetworkController from '../../controllers/NetworkController';

import isValid from './validate';
import type from './index'

export const networkInputFields = {
  slug: {
    description: 'Network slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  },
  name: {
    description: 'Network name.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const createNetwork = mutationWithClientMutationId({
  description: 'Create a network.',
  name: 'CreateNetwork',
  inputFields: networkInputFields,
  outputFields: { network: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return NetworkController.create(input);
  },
});

export default {
  createNetwork,
};
