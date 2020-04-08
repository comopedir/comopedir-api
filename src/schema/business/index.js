import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import NetworkType from '../network'

export const inputFields = {
  network: { type: GraphQLString },
  slug: { type: new GraphQLNonNull(GraphQLString) },
  name: { type: new GraphQLNonNull(GraphQLString) },
};


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
