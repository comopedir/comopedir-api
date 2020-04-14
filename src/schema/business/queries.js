import { fromGlobalId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../services/db';
import BusinessType from './index';

import BusinessController from '../../controllers/BusinessController';

const business = {
  type: BusinessType,
  args: {
    id: {
      type: GraphQLString,
    },
    airtableId: {
      type: GraphQLString,
    },
  },
  async resolve(_root, args, context) {
    const { id, airtableId } = args;

    let business;

    if (id) {
      business = await BusinessController.getByParam(
        'id', 
        fromGlobalId(id).id
      );
      
      if (!business) {
        throw new Error('Business not found.');
      }

      return context.businessById.load(business.id);
    }

    if (airtableId) {
      business = await BusinessController.getByParam(
        'airtable_id', 
        airtableId
      );
      
      if (!business) {
        return null
      }
      else {
        return context.businessById.load(business.id);
      }
    }
    
    return null;
  },
};

const businesses = {
  type: connectionDefinitions({
    name: 'Business',
    nodeType: BusinessType,
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
        .table('business')
        .limit(limit)
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.businessById.prime(x.id, x));
          return rows;
        }),
      db
        .table('business')
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
  businesses,
  business,
};
