import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  fromGlobalId,
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../services/db';
import LanguageType from './index';

import LanguageController from '../../controllers/LanguageController';

const language = {
  description: 'Fetches a language given its ID or slug.',
  type: LanguageType,
  args: {
    id: {
      type: GraphQLString,
    },
  },
  async resolve(_root, args, context) {
    const { id } = args;

    let language;

    if (id) {
      language = await LanguageController.getByParam(
        'id', 
        fromGlobalId(id).id
      );
      
      if (!language) {
        throw new Error('Language not found.');
      }

      return context.languageById.load(language.id);
    }
    
    return null;
  },
};

const languages = {
  description: 'Fetches system languages.',
  type: connectionDefinitions({
    name: 'Language',
    nodeType: LanguageType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(_root, args, ctx) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const [data, totalCount] = await Promise.all([
      db
        .table('language')
        .limit(limit)
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.languageById.prime(x.id, x));
          return rows;
        }),
      db
        .table('language')
        .count()
        .then(x => x[0].count),
    ]);

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: totalCount,
      }),
      totalCount,
    };
  },
};

export default {
  language,
  languages,
};
