import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';

import PictureController from '../../controllers/PictureController';

import isValid from './validate';
import type from './index'

export const createFromUrlInputFields = {
  business: { type: new GraphQLNonNull(GraphQLString) },
  url: { type: new GraphQLNonNull(GraphQLString) },
};

const createPictureFromUrl = mutationWithClientMutationId({
  name: 'CreatePictureFromUrl',
  inputFields: createFromUrlInputFields,
  outputFields: { picture: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return PictureController.createFromUrl(input);
  },
});

export default {
  createPictureFromUrl,
};
