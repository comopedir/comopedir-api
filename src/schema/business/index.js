import { globalIdField } from 'graphql-relay';
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
  
  fields: () => ({
    id: globalIdField(),
    network: {
      type: NetworkType,
      resolve(parent, _args, { networkById }) {
        if (parent.network) {
          return networkById.load(parent.network);
        }
        return null;
      },
    },
    airtableId: {
      type: GraphQLString,
      resolve(parent) {
        return parent.airtable_id;
      },
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    addresses: {
      type: new GraphQLList(AddressType),
      resolve(parent, _args, context) {
        return context.addressesByBusinessId.load(parent.id);
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, _args, context) {
        return context.categoriesByBusinessId.load(parent.id);
      },
    },
    channels: {
      type: new GraphQLList(BusinessChannelType),
      resolve(parent, _args, context) {
        return context.businessChannelsByBusinessId.load(parent.id);
      },
    },
    services: {
      type: new GraphQLList(ServiceType),
      resolve(parent, _args, context) {
        return context.servicesByBusinessId.load(parent.id);
      },
    },
    paymentTypes: {
      type: new GraphQLList(PaymentTypeType),
      resolve(parent, _args, context) {
        return context.paymentTypesByBusinessId.load(parent.id);
      },
    },
    pictures: {
      type: new GraphQLList(PictureType),
      resolve(parent, _args, context) {
        return context.picturesByBusinessId.load(parent.id);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
