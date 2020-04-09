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
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    priority: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent) {
        return parent.priority;
      },
    },
    translations: {
      type: new GraphQLList(TranslationType),
      resolve(parent, _args, { translationsByServiceId }) {
        return translationsByServiceId.load(parent.id);
      },
    },
  }),
});
