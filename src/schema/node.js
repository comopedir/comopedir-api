import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import { _assignType, getType } from '../utils';

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId, _context) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      // case 'User':
      //   return context.userById.load(id).then(assignType('User'));
      default:
        return null;
    }
  },
  obj => {
    switch (getType(obj)) {
      case 'User':
        return require('./user/UserType').default;
      default:
        return null;
    }
  },
);
