import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import PaymentTypeController from '../../controllers/PaymentTypeController';

import { isCreateValid, isAssociateValid } from './validate';
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
  paymentType: {
    description: 'Payment type ID.',
    type: new GraphQLNonNull(GraphQLString),
  },
};

const associatePaymentType = mutationWithClientMutationId({
  description: 'Associate a payment type with a business',
  name: 'AssociatePaymentType',
  inputFields: associatePaymentTypeInputFields,
  outputFields: { businessPaymentType: { type: BusinessPaymentTypeType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return PaymentTypeController.associate(input);
  },
});

export default {
  createPaymentType,
  associatePaymentType,
};
