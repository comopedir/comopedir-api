import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  fromGlobalId,
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../services/db';
import CategoryType from './index';

import CategoryController from '../../controllers/CategoryController';

const category = {
  description: 'Fetches a category given its ID or slug.',
  type: CategoryType,
  args: {
    id: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
  },
  async resolve(_root, args, context) {
    const { id, slug } = args;

    let category;

    if (id) {
      category = await CategoryController.getByParam(
        'id', 
        fromGlobalId(id).id
      );
      
      if (!category) {
        throw new Error('Category not found.');
      }

      return context.categoryById.load(category.id);
    }

    if (slug) {
      category = await CategoryController.getByParam(
        'slug', 
        slug
      );
      
      if (!category) {
        return null
      }
      else {
        return context.categoryById.load(category.id);
      }
    }
    
    return null;
  },
};

const categories = {
  description: 'Fetches business categories.',
  type: connectionDefinitions({
    name: 'Category',
    nodeType: CategoryType,
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
        .table('category')
        .orderBy('priority', 'desc')
        .limit(limit)
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.categoryById.prime(x.id, x));
          return rows;
        }),
      db
        .table('category')
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
  categories,
  category,
};
