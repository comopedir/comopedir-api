import { mutationWithClientMutationId } from 'graphql-relay';
import AirtableController from '../../controllers/AirtableController';
import isValid from './validate';
import BusinessType from '../business';
import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export const inputFields = {
  airtableId: {
    description: 'Imported Airtable ID.',
    type: new GraphQLNonNull(GraphQLString),
  },
  name: {
    description: 'Business name.',
    type: new GraphQLNonNull(GraphQLString),
  },
  services: {
    description: 'Business services.',
    type: new GraphQLList(GraphQLString),
  },
  channels: {
    description: 'Business channels.',
    type: new GraphQLList(GraphQLString),
  },
  categories: {
    description: 'Business categories.',
    type: new GraphQLList(GraphQLString),
  },
  pictures: {
    description: 'Business pictures.',
    type: new GraphQLList(GraphQLJSON)
  },
  website: {
    description: 'Business website.',
    type: GraphQLString,
  },
  whatsapp: {
    description: 'Business whatsapp.',
    type: GraphQLString,
  },
  phone: {
    description: 'Business phone.',
    type: GraphQLString,
  },
  state: {
    description: 'Business state.',
    type: GraphQLString,
  },
  city: {
    description: 'Business city.',
    type: GraphQLString,
  },
  instagram: {
    description: 'Business instagram.',
    type: GraphQLString,
  },
  email: {
    description: 'Business email.',
    type: GraphQLString,
  },
  approved: {
    description: 'Business is approved - not normalized. Expected `Sim` or `Não`, equivalent to `Yes` or `No` respectively.',
    type: GraphQLString,
  },
};

const importAirtableBusiness = mutationWithClientMutationId({
  description: 'Import a business from Airtable.',
  name: 'ImportAirtableBusiness',
  inputFields,
  outputFields: { business: { type: BusinessType } },
  mutateAndGetPayload: async input => {
    await isValid(input);
    return AirtableController.import(input);
  },
});

export default {
  importAirtableBusiness,
};
