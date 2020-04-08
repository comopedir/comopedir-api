import { mutationWithClientMutationId } from 'graphql-relay';
import AddressController from '../../controllers/AddressController';

import type, { inputFields } from './index';
import isValid from './validate';

const createAddress = mutationWithClientMutationId({
  name: 'CreateAddress',
  inputFields,
  outputFields: { address: { type } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['user']);
    await isValid(input);
    return AddressController.create(input, context.userLogged);
  },
});

export default {
  createAddress,
};
