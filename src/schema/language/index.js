import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Language',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),
    isoCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.iso_code;
      },
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
