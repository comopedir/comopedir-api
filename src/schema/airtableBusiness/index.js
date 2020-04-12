import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'AirtableBusiness',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    airtableId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    services: {
      type: new GraphQLList(GraphQLString),
    },
    channels: {
      type: new GraphQLList(GraphQLString),
    },
    categories: {
      type: new GraphQLList(GraphQLString),
    },
    pictures: {
      type: new GraphQLList(GraphQLJSON),
    },
    website: {
      type: GraphQLString,
    },
    whatsapp: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    state: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    instagram: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    approved: {
      type: GraphQLString,
    },
  }),
});
