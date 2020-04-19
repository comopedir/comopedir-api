import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../node';

import PictureType from '../picture';

export default new GraphQLObjectType({
  name: 'PictureFile',
  description: 'Represent a picture file reference for a picture.',
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    picture: {
      description: 'Related picture.',
      type: new GraphQLNonNull(PictureType),
      resolve(parent, _args, { pictureById }) {
        return pictureById.load(parent.picture);
      },
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Picture file url.',
    },
    size: {
      type: GraphQLInt,
      description: 'Picture size in bytes.',
    },
    width: {
      type: GraphQLInt,
      description: 'Picture width in pixels.',
    },
    height: {
      type: GraphQLInt,
      description: 'Picture height in pixels.',
    },
  }),
});
