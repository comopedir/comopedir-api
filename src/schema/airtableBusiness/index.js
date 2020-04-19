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
  description: 'Manage Airtable business bridge (access to Airtable records).',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    airtableId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Id of the business in Airtable.',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of business.',
    },
    services: {
      type: new GraphQLList(GraphQLString),
      description: 'List of services supported for the business.',
    },
    channels: {
      type: new GraphQLList(GraphQLString),
      description: 'List of channels supported for the business.',
    },
    categories: {
      type: new GraphQLList(GraphQLString),
      description: 'List of categories supported for the business.',
    },
    pictures: {
      type: new GraphQLList(GraphQLJSON),
      description: 'List of pictures of the business.',
    },
    website: {
      type: GraphQLString,
      description: 'Website of the business.',
    },
    whatsapp: {
      type: GraphQLString,
      description: 'Whatsapp of the business.',
    },
    phone: {
      type: GraphQLString,
      description: 'Phone number (consolidated) of the business.',
    },
    state: {
      type: GraphQLString,
      description: 'State of the business.',
    },
    city: {
      type: GraphQLString,
      description: 'City of the business.',
    },
    instagram: {
      type: GraphQLString,
      description: 'Instagram of the business.',
    },
    email: {
      type: GraphQLString,
      description: 'Email of the business.',
    },
    approved: {
      type: GraphQLString,
      description: 'Approved flag - not normalized. Expected `Sim` or `Não`, equivalent to `Yes` or `No` respectively.',
    },
  }),
});
