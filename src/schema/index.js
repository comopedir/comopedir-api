import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';

import categoryQueries from './category/queries';
import businessQueries from './business/queries';

import addressMutation from './address/mutation';
import businessMutation from './business/mutation';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      ...categoryQueries,
      ...businessQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...addressMutation,
      ...businessMutation,
    },
  }),
});
