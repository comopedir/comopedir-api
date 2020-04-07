import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
    },
  }),
});
