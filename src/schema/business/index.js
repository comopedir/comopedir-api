import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';

import NetworkType from '../network';
import AddressType from '../address';
import CategoryType from '../category';

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
