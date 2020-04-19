import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import BusinessType from '../business'
import ChannelType from '../channel'

export default new GraphQLObjectType({
  name: 'BusinessChannel',
  description: 'Business channel assignment.',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      description: 'Related business.',
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    channel: {
      type: new GraphQLNonNull(ChannelType),
      description: 'Related channel.',
      resolve(parent, _args, { channelById }) {
        return channelById.load(parent.channel);
      },
    },
    value: {
      type: GraphQLString,
      description: 'Channel configuration.',
    },
  }),
});
