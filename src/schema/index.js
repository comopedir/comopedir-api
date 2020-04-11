import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { nodeField, nodesField } from './node';

import categoryQueries from './category/queries';
import serviceQueries from './service/queries';
import businessQueries from './business/queries';
import channelQueries from './channel/queries';
import networkQueries from './network/queries';
import paymentTypeQueries from './paymentType/queries';
import accountQueries from './account/queries';

import sessionMutation from './session/mutation';
import addressMutation from './address/mutation';
import businessMutation from './business/mutation';
import categoryMutation from './category/mutation';
import serviceMutation from './service/mutation';
import channelMutation from './channel/mutation';
import networkMutation from './network/mutation';
import paymentTypeMutation from './paymentType/mutation';
import pictureMutation from './picture/mutation';
import personMutation from './person/mutation';

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
      ...networkQueries,
      ...paymentTypeQueries,
      ...accountQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...sessionMutation,
      ...addressMutation,
      ...businessMutation,
      ...categoryMutation,
      ...serviceMutation,
      ...channelMutation,
      ...networkMutation,
      ...paymentTypeMutation,
      ...pictureMutation,
      ...personMutation,
    },
  }),
});
