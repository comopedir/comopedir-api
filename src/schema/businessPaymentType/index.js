import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import BusinessType from '../business'
import PaymentTypeType from '../paymentType'

export default new GraphQLObjectType({
  name: 'BusinessPaymentType',
  description: 'Represent a payment type relationship with a business.',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      description: 'Related business.',
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    paymentType: {
      type: new GraphQLNonNull(PaymentTypeType),
      description: 'Related payment type.',
      resolve(parent, _args, { paymentTypeById }) {
        return paymentTypeById.load(parent.payment_type);
      },
    },
  }),
});
