import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Channel',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
