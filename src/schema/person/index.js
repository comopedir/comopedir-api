import { globalIdField } from 'graphql-relay';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import accountType from '../account';

export default new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: globalIdField(),
    name: { type: new GraphQLNonNull(GraphQLString) },
    birthdate: { type: new GraphQLNonNull(GraphQLString) },
    cpfCnpj: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.cpf_cnpj;
      },
    },
    account: {
      type: accountType,
      resolve(parent, _args, { accountById }) {
        return accountById.load(parent.account);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
