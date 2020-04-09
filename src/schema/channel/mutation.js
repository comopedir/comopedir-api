import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import ChannelController from '../../controllers/ChannelController';

import { isCreateValid, isAssociateValid } from './validate';
import ChannelType from './index';
import BusinessChannelType from '../businessChannel';

export const channelInputFields = {
  name: { type: new GraphQLNonNull(GraphQLString) },
};

const createChannel = mutationWithClientMutationId({
  name: 'CreateChannel',
  inputFields: channelInputFields,
  outputFields: { channel: { type: ChannelType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return ChannelController.create(input);
  },
});

export const associateChannelInputFields = {
  business: { type: new GraphQLNonNull(GraphQLString) },
  channel: { type: new GraphQLNonNull(GraphQLString) },
  value: { type: new GraphQLNonNull(GraphQLString) },
};

const associateChannel = mutationWithClientMutationId({
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
