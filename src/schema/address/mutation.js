import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';

import AddressController from '../../controllers/AddressController';

import isValid from './validate';
import type from './index'

export const addressInputFields = {
  latitude: { type: GraphQLFloat },
  longitude: { type: GraphQLFloat },
  business: { type: new GraphQLNonNull(GraphQLString) },
  street: { type: new GraphQLNonNull(GraphQLString) },
  streetNumber: { type: new GraphQLNonNull(GraphQLString) },
  complement: { type: GraphQLString },
  district: { type: new GraphQLNonNull(GraphQLString) },
  city: { type: new GraphQLNonNull(GraphQLString) },
  state: { type: new GraphQLNonNull(GraphQLString) },
  zipCode: { type: new GraphQLNonNull(GraphQLString) },
  country: { type: new GraphQLNonNull(GraphQLString) },
};

const createAddress = mutationWithClientMutationId({
  name: 'CreateAddress',
  inputFields: addressInputFields,
  outputFields: { address: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return AddressController.create(input);
  },
});

export default {
  createAddress,
};
