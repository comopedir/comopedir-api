import { globalIdField } from 'graphql-relay';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';

import BusinessType from '../business';

export default new GraphQLObjectType({
  name: 'Address',
  description: 'Manage addresses for a specific business.',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      description: 'Related business (address owner).',
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    latitude: {
      type: GraphQLFloat,
      description: 'Address latitude.',
    },
    longitude: {
      type: GraphQLFloat,
      description: 'Address longitude.',
    },
    current: {
      type: GraphQLBoolean,
      description: 'Flag for active address (current address must be true).',
    },
    street: {
      type: GraphQLString,
      description: 'Address street.',
    },
    streetNumber: {
      type: GraphQLString,
      description: 'Address street number.',
      resolve(parent) {
        return parent.street_number;
      },
    },
    complement: {
      type: GraphQLString,
      description: 'Address complement.',
    },
    district: {
      type: GraphQLString,
      description: 'Address district.',
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Address city.',
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Address state.',
    },
    zipCode: {
      type: GraphQLString,
      description: 'Address zip code.',
      resolve(parent) {
        return parent.zip_code;
      },
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Address country.',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Address creation date.',
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Address update date.',
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
