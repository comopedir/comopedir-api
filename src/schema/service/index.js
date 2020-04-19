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
  name: 'Service',
  description: 'Manage a service availability for each restaurant.',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Service slug (url identification).',
    },
    priority: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Service priority.',
      resolve(parent) {
        return parent.priority;
      },
    },
    translations: {
      type: new GraphQLList(TranslationType),
      description: 'Service translations.',
      resolve(parent, _args, { translationsByServiceId }) {
        return translationsByServiceId.load(parent.id);
      },
    },
  }),
});
