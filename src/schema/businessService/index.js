import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import BusinessType from '../business'
import ServiceType from '../service'

export default new GraphQLObjectType({
  name: 'BusinessService',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    service: {
      type: new GraphQLNonNull(ServiceType),
      resolve(parent, _args, { serviceById }) {
        return serviceById.load(parent.service);
      },
    },
  }),
});
