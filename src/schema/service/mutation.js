import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import ServiceController from '../../controllers/ServiceController';

import { isCreateValid, isAssociateValid } from './validate';
import ServiceType from './index';
import BusinessServiceType from '../businessService';

export const serviceInputFields = {
  slug: { type: new GraphQLNonNull(GraphQLString) },
  priority: { type: new GraphQLNonNull(GraphQLInt) },
};

const createService = mutationWithClientMutationId({
  name: 'CreateService',
  inputFields: serviceInputFields,
  outputFields: { service: { type: ServiceType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return ServiceController.create(input);
  },
});

export const associateServiceInputFields = {
  business: { type: new GraphQLNonNull(GraphQLString) },
  service: { type: new GraphQLNonNull(GraphQLString) },
};

const associateService = mutationWithClientMutationId({
  name: 'AssociateService',
  inputFields: associateServiceInputFields,
  outputFields: { businessService: { type: BusinessServiceType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return ServiceController.associate(input);
  },
});

export default {
  createService,
  associateService,
};
