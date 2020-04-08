import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import NetworkController from '../../controllers/NetworkController';

import isValid from './validate';
import type from './index'

export const networkInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
};

const createNetwork = mutationWithClientMutationId({
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
