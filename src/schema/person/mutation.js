import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import PersonController from '../../controllers/PersonController';

import PersonType from './index';
import isValid from './validate';

export const inputFields = {
  name: {
    description: 'Person name.',
    type: new GraphQLNonNull(GraphQLString),
  },
  password: {
    description: 'Person password.',
    type: GraphQLString,
  },
  birthdate: {
    description: 'Person birth date.',
    type: new GraphQLNonNull(GraphQLString),
  },
  email: {
    description: 'Person email.',
    type: new GraphQLNonNull(GraphQLString),
  },
  cpfCnpj: {
    description: 'Person identification document (CPF or CNPJ).',
    type: new GraphQLNonNull(GraphQLString)
  },
};

const createPerson = mutationWithClientMutationId({
  description: 'Create a person.',
  name: 'CreatePerson',
  inputFields,
  outputFields: {
    person: { type: PersonType },
  },
  mutateAndGetPayload: async (input, context) => {
    // await context.isAuthorized(['user']);
    await isValid(input);
    // const { accountId } = context.userLogged;
    const person = await PersonController.create({ input });
    return { person };
  },
});

export default {
  createPerson,
};
