import { globalIdField } from 'graphql-relay';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';

import NetworkType from '../network';
import AddressType from '../address';
import CategoryType from '../category';
import BusinessChannelType from '../businessChannel';
import ServiceType from '../service';
import PaymentTypeType from '../paymentType';
import PictureType from '../picture';

export default new GraphQLObjectType({
  name: 'Business',
  description: 'Represent a business (restaurant or other food related business).',
  
  fields: () => ({
    id: globalIdField(),
    network: {
      type: NetworkType,
      description: 'Related network (optional).',
      resolve(parent, _args, { networkById }) {
        if (parent.network) {
          return networkById.load(parent.network);
        }
        return null;
      },
    },
    airtableId: {
      type: GraphQLString,
      description: 'Business Airtable origin (optional, if the entry is imported from Airtable).',
      resolve(parent) {
        return parent.airtable_id;
      },
    },
    slug: {
      description: 'Business slug (url identification).',
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      description: 'Business name.',
      type: new GraphQLNonNull(GraphQLString),
    },
    addresses: {
      type: new GraphQLList(AddressType),
      description: 'Business addresses (list) with one address active.',
      resolve(parent, _args, context) {
        return context.addressesByBusinessId.load(parent.id);
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      description: 'Business categories.',
      resolve(parent, _args, context) {
        return context.categoriesByBusinessId.load(parent.id);
      },
    },
    channels: {
      type: new GraphQLList(BusinessChannelType),
      description: 'Business selling channels.',
      resolve(parent, _args, context) {
        return context.businessChannelsByBusinessId.load(parent.id);
      },
    },
    services: {
      type: new GraphQLList(ServiceType),
      description: 'Business supported services.',
      resolve(parent, _args, context) {
        return context.servicesByBusinessId.load(parent.id);
      },
    },
    paymentTypes: {
      type: new GraphQLList(PaymentTypeType),
      description: 'Business supported payment types.',
      resolve(parent, _args, context) {
        return context.paymentTypesByBusinessId.load(parent.id);
      },
    },
    pictures: {
      type: new GraphQLList(PictureType),
      description: 'Business pictures.',
      resolve(parent, _args, context) {
        return context.picturesByBusinessId.load(parent.id);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Business creation date.',
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Business update date.',
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
