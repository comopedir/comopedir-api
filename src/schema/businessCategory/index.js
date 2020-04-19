import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import BusinessType from '../business'
import CategoryType from '../category'

export default new GraphQLObjectType({
  name: 'BusinessCategory',
  description: 'Represent a category relationship with a business.',
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      description: 'Related business.',
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    category: {
      type: new GraphQLNonNull(CategoryType),
      description: 'Related category.',
      resolve(parent, _args, { categoryById }) {
        return categoryById.load(parent.category);
      },
    },
  }),
});
