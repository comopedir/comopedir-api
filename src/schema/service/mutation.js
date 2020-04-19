import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import ServiceController from '../../controllers/ServiceController';

import { isCreateValid, isAssociateValid } from './validate';
import ServiceType from './index';
import BusinessServiceType from '../businessService';

export const serviceInputFields = {
  slug: {
    description: 'Service slug (url identification).',
    type: new GraphQLNonNull(GraphQLString),
  },
  priority: {
    description: 'Service priority.',
    type: new GraphQLNonNull(GraphQLInt),
  },
};

const createService = mutationWithClientMutationId({
  description: 'Create a service',
  name: 'CreateService',
  inputFields: serviceInputFields,
  outputFields: { service: { type: ServiceType } },
  mutateAndGetPayload: async (input, _context) => {
    await isCreateValid(input);
    return ServiceController.create(input);
  },
});

export const associateServiceInputFields = {
  business: {
    description: 'Related business (ID).',
    type: new GraphQLNonNull(GraphQLID),
  },
  service: {
    description: 'Related service (ID).',
    type: new GraphQLNonNull(GraphQLID),
  },
};

const associateService = mutationWithClientMutationId({
  description: 'Associate a service with a business.',
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
