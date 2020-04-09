import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import PaymentTypeController from '../../controllers/PaymentTypeController';

import { isCreateValid, isAssociateValid } from './validate';
import PaymentTypeType from './index';
import BusinessPaymentTypeType from '../businessPaymentType';

export const paymentTypeInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createPaymentType = mutationWithClientMutationId({
  name: 'CreatePaymentType',
  inputFields: paymentTypeInputFields,
  outputFields: { paymentType: { type: PaymentTypeType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return PaymentTypeController.create(input);
  },
});

export const associatePaymentTypeInputFields = {
  business: { type: new GraphQLNonNull(GraphQLString) },
  paymentType: { type: new GraphQLNonNull(GraphQLString) },
};

const associatePaymentType = mutationWithClientMutationId({
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
