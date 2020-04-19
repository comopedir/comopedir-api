import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Network',
  description: 'Represent a business network for business.',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Network slug (url identification).',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Network name.',
    },
  },
});
