import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import ServiceController from '../../controllers/ServiceController';

import isValid from './validate';
import type from './index'

export const serviceInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createService = mutationWithClientMutationId({
  name: 'CreateService',
  inputFields: serviceInputFields,
  outputFields: { service: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return ServiceController.create(input);
  },
});

export default {
  createService,
};
