import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import PersonController from '../../controllers/PersonController';

import PersonType from './index';
import isValid from './validate';

export const inputFields = {
  name: { type: new GraphQLNonNull(GraphQLString) },
  password: { type: GraphQLString },
  birthdate: { type: new GraphQLNonNull(GraphQLString) },
  email: { type: new GraphQLNonNull(GraphQLString) },
  cpfCnpj: { type: new GraphQLNonNull(GraphQLString) },
};

const createPerson = mutationWithClientMutationId({
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
