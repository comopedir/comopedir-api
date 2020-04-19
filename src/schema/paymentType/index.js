import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';
import TranslationType from '../translation';

export default new GraphQLObjectType({
  name: 'PaymentType',
  description: 'Manage Payment types.',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Payment type slug (url identification).',
    },
    priority: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Paynment type priority.',
      resolve(parent) {
        return parent.priority;
      },
    },
    translations: {
      type: new GraphQLList(TranslationType),
      description: 'Payment type translations.',
      resolve(parent, _args, { translationsByPaymentTypeId }) {
        return translationsByPaymentTypeId.load(parent.id);
      },
    },
  }),
});
