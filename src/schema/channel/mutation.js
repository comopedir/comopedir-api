import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import ChannelController from '../../controllers/ChannelController';

import isValid from './validate';
import type from './index'

export const channelInputFields = {
  name: { type: new GraphQLNonNull(GraphQLString) },
};

const createChannel = mutationWithClientMutationId({
  name: 'CreateChannel',
  inputFields: channelInputFields,
  outputFields: { channel: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return ChannelController.create(input);
  },
});

export default {
  createChannel,
};
