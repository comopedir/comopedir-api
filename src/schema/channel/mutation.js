import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
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

export const associateChannelInputFields = {
  business: {
    description: 'Related business ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  channel: {
    description: 'Related channel ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  value: {
    description: 'Channel specific configuration (url, parameter or other value to supply channel config).',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const associateChannel = mutationWithClientMutationId({
  description: 'Associate a channel with a business.',
  name: 'AssociateChannel',
  inputFields: associateChannelInputFields,
  outputFields: { businessChannel: { type: BusinessChannelType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return ChannelController.associate(input);
  },
});

export default {
  createChannel,
  associateChannel,
};
