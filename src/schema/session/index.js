import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';

import PersonType from '../person';

export const inputFields = {
  username: {
    description: 'Authentication username.',
    type: GraphQLString,
  },
  phoneNumber: {
    description: 'Authentication phone number.',
    type: GraphQLInt,
  },
  phoneAreaCode: {
    description: 'Authentication area code.',
    type: GraphQLInt,
  },
  phoneCountryCode: {
    description: 'Authentication phone country code.',
    type: GraphQLInt,
  },
  email: {
    description: 'Authentication email.',
    type: GraphQLString,
  },
  password: {
    description: 'Authentication password.',
    type: new GraphQLNonNull(GraphQLString),
  },
  role: {
    description: 'Authentication requested role.',
    type: GraphQLString
  },
};

export const outputFields = {
  token: { type: GraphQLString },
  role: { type: GraphQLString },
  person: {
    type: PersonType,
    resolve(parent, _args, { personById }) {
      return parent.person && personById.load(parent.person.id);
    },
  },
};
