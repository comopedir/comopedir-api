import { globalIdField } from 'graphql-relay';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';

export default new GraphQLObjectType({
  name: 'Address',
  
  fields: () => ({
    id: globalIdField(),
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    current: { type: GraphQLBoolean },
    street: { type: new GraphQLNonNull(GraphQLString) },
    streetNumber: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.street_number;
      },
    },
    complement: { type: GraphQLString },
    district: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    zipCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.zip_code;
      },
    },
    country: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
