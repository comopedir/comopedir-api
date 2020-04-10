import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';
import PictureFileType from '../pictureFile';
import BusinessType from '../business';

export default new GraphQLObjectType({
  name: 'Picture',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    business: {
      type: new GraphQLNonNull(BusinessType),
      resolve(parent, _args, { businessById }) {
        return businessById.load(parent.business);
      },
    },
    type: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    originId: {
      type: GraphQLString,
      resolve(parent) {
        return parent.origin_id;
      },
    },
    raw: {
      type: PictureFileType,
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.raw);
      },
    },
    small: {
      type: PictureFileType,
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.small);
      },
    },
    large: {
      type: PictureFileType,
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.large);
      },
    },
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
