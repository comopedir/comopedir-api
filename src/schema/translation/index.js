import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';
import LanguageType from '../language';

export default new GraphQLObjectType({
  name: 'Translation',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    language: {
      type: new GraphQLNonNull(LanguageType),
      resolve(parent, args, { languageById }) {
        return languageById.load(parent.language);
      },
    },

    name: {
      type: new GraphQLNonNull(GraphQLString),
    },

    description: {
      type: GraphQLString,
    },
  }),
});
