import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';

import BusinessController from '../../controllers/BusinessController';
import isValid from './validate';
import type from './index'

export const businessInputFields = {
  network: { type: GraphQLString },
  slug: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
};

const createBusiness = mutationWithClientMutationId({
  name: 'CreateBusiness',
  inputFields: businessInputFields,
  outputFields: { business: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return BusinessController.create(input);
  },
});

export default {
  createBusiness,
};
