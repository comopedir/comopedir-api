import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import PaymentTypeController from '../../controllers/PaymentTypeController';

import { isCreateValid, isAssociateValid, isUpdateValid } from './validate';
import PaymentTypeType from './index';
import BusinessPaymentTypeType from '../businessPaymentType';

export const paymentTypeInputFields = {
  slug: {
    description: 'Payment type slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  },
  priority: {
    description: 'Payment type.',
    type: new GraphQLNonNull(GraphQLInt),
  },
};

const createPaymentType = mutationWithClientMutationId({
  description: 'Create a payment type.',
  name: 'CreatePaymentType',
  inputFields: paymentTypeInputFields,
  outputFields: { paymentType: { type: PaymentTypeType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return PaymentTypeController.create(input);
  },
});

export const associatePaymentTypeInputFields = {
  business: {
    description: 'Business related ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  paymentTypes: {
    description: 'Payment type ID list.',
    type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
  },
};

const associatePaymentTypes = mutationWithClientMutationId({
  description: 'Associate a payment type with a business',
  name: 'AssociatePaymentTypes',
  inputFields: associatePaymentTypeInputFields,
  outputFields: { businessPaymentType: { type: BusinessPaymentTypeType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return PaymentTypeController.associate(input);
  },
});

export const updatePaymentTypeInputFields = {
  paymentType: {
    description: 'Payment type ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
  field: {
    description: 'Payment type field to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
  value: {
    description: 'Payment type value to update.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const updatePaymentType = mutationWithClientMutationId({
  description: 'Update a payment type.',
  name: 'UpdatePaymentType',
  inputFields: updatePaymentTypeInputFields,
  outputFields: { paymentType: { type: PaymentTypeType } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isUpdateValid(input);
    return PaymentTypeController.update(input, context);
  },
});

export const deletePaymentTypeInputFields = {
  category: {
    description: 'Payment type ID.',
    type: new GraphQLNonNull(GraphQLID),
  },
};

const deletePaymentType = mutationWithClientMutationId({
  description: 'Delete a payment type.',
  name: 'DeletePaymentType',
  inputFields: deletePaymentTypeInputFields,
  outputFields: { paymentType: { type: PaymentTypeType } },
  mutateAndGetPayload: async (input, context) => {
    context.isAuthorized(['admin']);
    await isDeleteValid(input);
    return PaymentTypeController.delete(input, context);
  },
});

export default {
  createPaymentType,
  associatePaymentTypes,
  updatePaymentType,
  deletePaymentType,
};
