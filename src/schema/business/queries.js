import { fromGlobalId } from 'graphql-relay';
import { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLID, GraphQLBoolean } from 'graphql';
import {
  connectionDefinitions,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../services/db';
import BusinessType from './index';

import BusinessController from '../../controllers/BusinessController';

const business = {
  description: 'Fetches a business given its ID.',
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

const getBusiness = (db, limit, filter, filterValue, order, offset, ctx) => {
  if (filter) {
    return db
      .table('business')
      .limit(limit)
      .whereRaw(filter, filterValue)
      .orderBy(order)
      .offset(offset)
      .then(rows => {
        rows.forEach(x => ctx.businessById.prime(x.id, x));
        return rows;
      });
  }

  return db
    .table('business')
    .limit(limit)
    .orderBy(order)
    .offset(offset)
    .then(rows => {
      rows.forEach(x => ctx.businessById.prime(x.id, x));
      return rows;
    });
};

const getBusinessCount = (db, filter, filterValue) => {
  if (filter) {
    return db
      .table('business')
      .whereRaw(filter, filterValue)
      .count()
      .then(x => x[0].count);    
  }

  return db
    .table('business')
    .count()
    .then(x => x[0].count);
};

const businesses = {
  description: 'Fetches businesses.',
  type: connectionDefinitions({
    name: 'Business',
    nodeType: BusinessType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: {
    after: { type: GraphQLInt },
    first: { type: GraphQLInt },
    latest: { type: GraphQLBoolean },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    category: { type: GraphQLID },
    service: { type: GraphQLID },
    paymentType: { type: GraphQLID },
    channel: { type: GraphQLID },
  },
  async resolve(_root, args, ctx) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    let filter = null;
    let filterValue = null;
    let order = [{column: 'name', order: 'asc'}];

    if (args.latest) {
      order = [{column: 'created_at', order: 'desc'}];
    }

    if (args.city) {
      if (args.state) {
        filter = ' id IN ( SELECT DISTINCT(business) FROM address WHERE state = ? AND city = ?) ';
        filterValue = [args.state, args.city];
      }
      else {
        throw new Error('You can\'t specify a city without a state.');
      }
    } else if (args.state) {
      filter = ' id IN ( SELECT DISTINCT(business) FROM address WHERE state = ?) ';
      filterValue = [args.state];
    }

    if (args.category) {
      if (filter) filter += ' AND ';
      filter += ' id IN ( SELECT DISTINCT(business) FROM business_category  WHERE category = ?) ';
      filterValue.push(fromGlobalId(args.category).id);
    }

    if (args.service) {
      if (filter) filter += ' AND ';
      filter += ' id IN ( SELECT DISTINCT(business) FROM business_service  WHERE service = ?) ';
      filterValue.push(fromGlobalId(args.service).id);
    }

    if (args.paymentType) {
      if (filter) filter += ' AND ';
      filter += ' id IN ( SELECT DISTINCT(business) FROM business_payment_type  WHERE payment_type = ?) ';
      filterValue.push(fromGlobalId(args.paymentType).id);
    }

    if (args.channel) {
      if (filter) filter += ' AND ';
      filter += ' id IN ( SELECT DISTINCT(business) FROM business_channel  WHERE channel = ?) ';
      filterValue.push(fromGlobalId(args.channel).id);
    }

    const [data, totalCount] = await Promise.all([
      getBusiness(db, limit, filter, filterValue, order, offset, ctx),
      getBusinessCount(db, filter, filterValue),
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
