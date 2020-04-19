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
  description: 'Represent a system account.',
  fields: () => ({
    id: globalIdField(),
    person: {
      type: personType,
      description: 'Related person.',
      resolve(parent, _args, { personByAccount }) {
        return personByAccount.load(parent.id);
      },
    },
    phoneNumber: {
      type: GraphQLInt,
      description: 'Account phone number.',
      resolve(parent) {
        return parent.phone_number;
      },
    },
    phoneAreaCode: {
      type: GraphQLInt,
      description: 'Account phone area code.',
      resolve(parent) {
        return parent.phone_area_code;
      },
    },
    phoneCountryCode: {
      type: GraphQLInt,
      description: 'Account phone country code.',
      resolve(parent) {
        return parent.phone_country_code;
      },
    },
    email: {
      type: GraphQLString,
      description: 'Account email.',
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
      description: 'Account status.',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Account creation date.',
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Account update date.',
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
