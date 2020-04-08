import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';

import categoryQueries from './category/queries';
import serviceQueries from './service/queries';
import businessQueries from './business/queries';
import channelQueries from './channel/queries';

import addressMutation from './address/mutation';
import businessMutation from './business/mutation';
import categoryMutation from './category/mutation';
import serviceMutation from './service/mutation';
import channelMutation from './channel/mutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      ...categoryQueries,
      ...businessQueries,
      ...serviceQueries,
      ...channelQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...addressMutation,
      ...businessMutation,
      ...categoryMutation,
      ...serviceMutation,
      ...channelMutation,
    },
  }),
});
