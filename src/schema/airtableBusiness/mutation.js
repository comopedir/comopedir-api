import { mutationWithClientMutationId } from 'graphql-relay';
import AirtableController from '../../controllers/AirtableController';
import isValid from './validate';
import BusinessType from '../business';
import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export const inputFields = {
  airtableId: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
  services: { type: new GraphQLList(GraphQLString) },
  channels: { type: new GraphQLList(GraphQLString) },
  categories: { type: new GraphQLList(GraphQLString) },
  pictures: { type: new GraphQLList(GraphQLJSON) },
  website: { type: new GraphQLList(GraphQLString) },
  whatsapp: { type: new GraphQLList(GraphQLString) },
  phone: { type: GraphQLString },
  state: { type: GraphQLString },
  city: { type: GraphQLString },
  instagram: { type: GraphQLString },
  email: { type: GraphQLString },
  approved: { type: GraphQLString },
};

const importAirtableBusiness = mutationWithClientMutationId({
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
