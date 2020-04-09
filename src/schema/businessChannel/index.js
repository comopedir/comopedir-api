import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import BusinessType from '../business'
import ChannelType from '../channel'

export default new GraphQLObjectType({
  name: 'BusinessChannel',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    channel: {
      type: new GraphQLNonNull(ChannelType),
      resolve(parent, _args, { channelById }) {
        return channelById.load(parent.channel);
      },
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
