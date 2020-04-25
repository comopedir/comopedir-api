import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLID } from 'graphql';

import AddressController from '../../controllers/AddressController';

import isValid from './validate';
import type from './index'

export const addressInputFields = {
  latitude: {
    description: 'Address latitude in decimal degress (DD).',
    type: GraphQLFloat, 
  },
  longitude: {
    description: 'Address longitude in decimal degress (DD).',
    type: GraphQLFloat,
  },
  business: {
    description: 'Related business.',
    type: new GraphQLNonNull(GraphQLID),
  },
  street: {
    description: 'Address street.',
    type: new GraphQLNonNull(GraphQLString),
  },
  streetNumber: {
    description: 'Address street number.',
    type: new GraphQLNonNull(GraphQLString),
  },
  complement: {
    description: 'Address complement.',
    type: GraphQLString,
  },
  district: {
    description: 'Address district.',
    type: new GraphQLNonNull(GraphQLString),
  },
  city: {
    description: 'Address city.',
    type: new GraphQLNonNull(GraphQLString),
  },
  state: {
    description: 'Address state.',
    type: new GraphQLNonNull(GraphQLString),
  },
  zipCode: {
    description: 'Address zip code.',
    type: new GraphQLNonNull(GraphQLString),
  },
  country: {
    description: 'Address country.',
    type: new GraphQLNonNull(GraphQLString)
  },
};

const createAddress = mutationWithClientMutationId({
  name: 'CreateAddress',
  description: 'Create address for a business.',
  inputFields: addressInputFields,
  outputFields: { address: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return AddressController.create(input);
  },
});

const updateAddress = mutationWithClientMutationId({
  name: 'UpdateAddress',
  description: 'Update an address for a business.',
  inputFields: { id: { type: GraphQLID }, ...addressInputFields },
  outputFields: { address: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return AddressController.update(input);
  },
});

export default {
  updateAddress,
  createAddress,
};
