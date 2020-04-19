import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';
import LanguageType from '../language';

export default new GraphQLObjectType({
  name: 'Translation',
  description: 'Represent a translation.',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    language: {
      type: new GraphQLNonNull(LanguageType),
      description: 'Related language.',
      resolve(parent, args, { languageById }) {
        return languageById.load(parent.language);
      },
    },

    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Translation name.',
    },

    description: {
      type: GraphQLString,
      description: 'Translation description.',
    },
  }),
});
