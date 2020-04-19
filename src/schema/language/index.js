import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Language',
  description: 'Manage languages.',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),
    isoCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Language iso code.',
      resolve(parent) {
        return parent.iso_code;
      },
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Language name.',
    },
  },
});
