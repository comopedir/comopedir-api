import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';

import PersonType from '../person';

export const inputFields = {
  username: { type: GraphQLString },
  phoneNumber: { type: GraphQLInt },
  phoneAreaCode: { type: GraphQLInt },
  phoneCountryCode: { type: GraphQLInt },
  email: { type: GraphQLString },
  password: { type: new GraphQLNonNull(GraphQLString) },
  role: { type: GraphQLString },
};

export const outputFields = {
  token: { type: GraphQLString },
  role: { type: GraphQLString },
  person: {
    type: PersonType,
    resolve(parent, args, { personById }) {
      return parent.person && personById.load(parent.person.id);
    },
  },
};
