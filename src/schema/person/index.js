import { globalIdField } from 'graphql-relay';
import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import accountType from '../account';

export default new GraphQLObjectType({
  name: 'Person',
  description: 'Represent a person.',
  fields: () => ({
    id: globalIdField(),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Person name.',
    },
    birthdate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Person birth date.',
    },
    cpfCnpj: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Person identification document (CPF or CNPJ).',
      resolve(parent) {
        return parent.cpf_cnpj;
      },
    },
    account: {
      type: accountType,
      description: 'Related system account.',
      resolve(parent, _args, { accountById }) {
        return accountById.load(parent.account);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Person creation date.',
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Person update date.',
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
