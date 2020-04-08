import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import PaymentTypeController from '../../controllers/PaymentTypeController';

import isValid from './validate';
import type from './index'

export const paymentTypeInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createPaymentType = mutationWithClientMutationId({
  name: 'CreatePaymentType',
  inputFields: paymentTypeInputFields,
  outputFields: { paymentType: { type } },
  mutateAndGetPayload: async (input, _context) => {
    await isValid(input);
    return PaymentTypeController.create(input);
  },
});

export default {
  createPaymentType,
};
