import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';

export default new GraphQLObjectType({
  name: 'Channel',
  description: 'Manage channels.',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Channel name.',
    },
  }),
});
