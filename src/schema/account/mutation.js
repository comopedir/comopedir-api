import { GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import AccountController from '../../controllers/AccountController';

import isValid from './validate';

export const inputFields = {
  phoneNumber: { type: new GraphQLNonNull(GraphQLInt) },
  phoneAreaCode: { type: new GraphQLNonNull(GraphQLInt) },
  phoneCountryCode: { type: new GraphQLNonNull(GraphQLInt) },
};

export const inputFieldsCode = {
  ...inputFields,
  code: { type: new GraphQLNonNull(GraphQLInt) },
};

export const inputFieldsChangePassword = {
  ...inputFields,
  code: { type: new GraphQLNonNull(GraphQLInt) },
  password: { type: new GraphQLNonNull(GraphQLString) },
};

export const inputType = new GraphQLInputObjectType({
  name: 'accountInput',
  fields: {
    id: { type: GraphQLID },
    phoneNumber: { type: GraphQLInt },
    phoneAreaCode: { type: GraphQLInt },
    phoneCountryCode: { type: GraphQLInt },
    status: { type: GraphQLString },
  },
});

const createAccountFromPhoneNumber = mutationWithClientMutationId({
  name: 'CreateAccountFromPhoneNumber',
  inputFields,
  outputFields: { account: { type } },
  mutateAndGetPayload: async input => {
    await isValid(input);
    const account = await AccountController.createFromPhoneNumber({ input });
    return { account };
  },
});

const activateAccountFromPhoneNumber = mutationWithClientMutationId({
  name: 'ActivateAccountFromPhoneNumber',
  inputFields: inputFieldsCode,
  outputFields: { token: { type: GraphQLString } },
  mutateAndGetPayload: async input => AccountController.activateFromPhoneNumber(input),
});

const resendActivationCodeFromPhoneNumber = mutationWithClientMutationId({
  name: 'ResendActivationCodeFromPhoneNumber',
  inputFields,
  outputFields: {
    id: { type: GraphQLID },
    status: { type: GraphQLString },
  },
  mutateAndGetPayload: async input => AccountController.resendCodeFromPhoneNumber(input),
});

export default {
  createAccountFromPhoneNumber,
  activateAccountFromPhoneNumber,
  resendActivationCodeFromPhoneNumber,
};
