import { mutationWithClientMutationId } from 'graphql-relay';
import SessionController from '../../controllers/SessionController';
import { inputFields, outputFields } from './index';
import isValid from './validate';

const auth = mutationWithClientMutationId({
  description: 'Authenticate an account.',
  name: 'Auth',
  inputFields,
  outputFields,
  mutateAndGetPayload: async input => {
    await isValid(input);
    return SessionController.authenticate(input);
  },
});

export default {
  auth,
};
