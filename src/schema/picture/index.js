import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';
import PictureFileType from '../pictureFile';
import BusinessType from '../business';

export default new GraphQLObjectType({
  name: 'Picture',
  description: 'Manage pictures for each business.',
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
      description: 'Picture type (MIME type) from importing system.',
    },
    description: {
      type: GraphQLString,
      description: 'Picture description.',
    },
    originId: {
      type: GraphQLString,
      description: 'Picture origin id or url.',
      resolve(parent) {
        return parent.origin_id;
      },
    },
    raw: {
      type: PictureFileType,
      description: 'Related picture file in raw version (copy of original).',
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.raw);
      },
    },
    small: {
      type: PictureFileType,
      description: 'Related picture file in small version (resampled).',
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.small);
      },
    },
    large: {
      type: PictureFileType,
      description: 'Related picture file in large version (resampled).',
      resolve(parent, _args, { pictureFileById }) {
        return pictureFileById.load(parent.large);
      },
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Picture creation date.',
      resolve(parent) {
        return parent.created_at;
      },
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
      description: 'Picture update date.',
      resolve(parent) {
        return parent.updated_at;
      },
    },
  }),
});
