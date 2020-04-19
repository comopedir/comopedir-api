import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';
import TranslationType from '../translation';

export default new GraphQLObjectType({
  name: 'Category',
  description: 'Represent a business category.',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Category slug (url identification).',
    },
    priority: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Category priority.',
      resolve(parent) {
        return parent.priority;
      },
    },
    translations: {
      type: new GraphQLList(TranslationType),
      description: 'Category translations.',
      resolve(parent, _args, { translationsByCategoryId }) {
        return translationsByCategoryId.load(parent.id);
      },
    },
  }),
});
