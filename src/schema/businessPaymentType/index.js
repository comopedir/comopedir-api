import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import BusinessType from '../business'
import PaymentTypeType from '../paymentType'

export default new GraphQLObjectType({
  name: 'BusinessPaymentType',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    paymentType: {
      type: new GraphQLNonNull(PaymentTypeType),
      resolve(parent, _args, { paymentTypeById }) {
        return paymentTypeById.load(parent.payment_type);
      },
    },
  }),
});
