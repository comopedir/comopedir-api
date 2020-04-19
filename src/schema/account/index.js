import { globalIdField } from 'graphql-relay';
import { GraphQLDateTime } from 'graphql-iso-date';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import personType from '../person';

export default new GraphQLObjectType({
  name: 'Account',
  fields: () => ({
    id: globalIdField(),
    person: {
      type: personType,
      resolve(parent, _args, { personByAccount }) {
        return personByAccount.load(parent.id);
      },
    },
    phoneNumber: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.phone_number;
      },
    },
    phoneAreaCode: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.phone_area_code;
      },
    },
    phoneCountryCode: {
      type: GraphQLInt,
      resolve(parent) {
        return parent.phone_country_code;
      },
    },
    email: {
      type: GraphQLString,
    },
    status: {
      type: new GraphQLEnumType({
        name: 'status',
        values: {
          active: { value: 'active' },
          pending: { value: 'pending' },
          disabled: { value: 'disabled' },
        },
      }),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
