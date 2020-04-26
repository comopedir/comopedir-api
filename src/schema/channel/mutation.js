import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import ChannelController from '../../controllers/ChannelController';

import { isCreateValid, isAssociateValid } from './validate';
import ChannelType from './index';
import BusinessChannelType from '../businessChannel';

export const channelInputFields = {
  name: {
    description: 'Channel name.',
    type: new GraphQLNonNull(GraphQLString),
  },
  slug: {
    description: 'Channel slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  }
};

const createChannel = mutationWithClientMutationId({
  description: 'Create a channel.',
  name: 'CreateChannel',
  inputFields: channelInputFields,
  outputFields: { channel: { type: ChannelType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return ChannelController.create(input);
  },
});

export const associateChannelsInputFields = {
  business: {
    description: 'Related business ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  channels: {
    description: 'Related channel ID and value combination.',
    type: new GraphQLList(new GraphQLNonNull(GraphQLJSON)),
  },
};

const associateChannels = mutationWithClientMutationId({
  description: 'Associate channels with a business.',
  name: 'AssociateChannels',
  inputFields: associateChannelsInputFields,
  outputFields: { businessChannel: { type: BusinessChannelType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return ChannelController.associate(input);
  },
});

export default {
  createChannel,
  associateChannels,
};
