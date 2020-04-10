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
  interfaces: [nodeInterface],
  
  fields: () => ({
    id: globalIdField(),
    picture: {
      type: new GraphQLNonNull(PictureType),
      resolve(parent, _args, { pictureById }) {
        return pictureById.load(parent.picture);
      },
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    size: {
      type: GraphQLInt,
    },
    width: {
      type: GraphQLInt,
    },
    height: {
      type: GraphQLInt,
    },
  }),
});
