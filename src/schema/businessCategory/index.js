import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType } from 'graphql';

import BusinessType from '../business'
import CategoryType from '../category'

export default new GraphQLObjectType({
  name: 'BusinessCategory',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: BusinessType,
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    category: {
      type: CategoryType,
      resolve(parent, _args, { categoryById }) {
        return categoryById.load(parent.category);
      },
    },
  }),
});
