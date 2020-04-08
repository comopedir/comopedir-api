import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Network',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
