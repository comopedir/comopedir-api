import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
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

export const associateServicesInputFields = {
  business: {
    description: 'Related business (ID).',
    type: new GraphQLNonNull(GraphQLID),
  },
  services: {
    description: 'Related services (ID list).',
    type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
  },
};

const associateServices = mutationWithClientMutationId({
  description: 'Associate services with a business.',
  name: 'AssociateServices',
  inputFields: associateServicesInputFields,
  outputFields: { businessService: { type: BusinessServiceType } },
  mutateAndGetPayload: async (input, _context) => {
    await isAssociateValid(input);
    return ServiceController.associate(input);
  },
});

export default {
  createService,
  associateServices,
};
