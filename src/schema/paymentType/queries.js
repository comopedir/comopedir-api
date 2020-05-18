import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
  fromGlobalId,
} from 'graphql-relay';

import db from '../../services/db';
import PaymentType from './index';

import PaymentTypeController from '../../controllers/PaymentTypeController';

const paymentType = {
  description: 'Fetches a payment given its ID or slug.',
  type: PaymentType,
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

    let paymentType;

    if (id) {
      paymentType = await PaymentTypeController.getByParam(
        'id', 
        fromGlobalId(id).id
      );
      
      if (!paymentType) {
        throw new Error('Payment type not found.');
      }

      return context.paymentTypeById.load(paymentType.id);
    }

    if (slug) {
      paymentType = await PaymentTypeController.getByParam(
        'slug', 
        slug
      );
      
      if (!paymentType) {
        return null
      }
      else {
        return context.paymentTypeById.load(paymentType.id);
      }
    }
    
    return null;
  },
};


const paymentTypes = {
  description: 'Fetches business payment types.',
  type: connectionDefinitions({
    name: 'PaymentType',
    nodeType: PaymentType,
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
        .table('payment_type')
        .limit(limit)
        .orderBy('priority', 'desc')
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.channelById.prime(x.id, x));
          return rows;
        }),
      db
        .table('payment_type')
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
  paymentType,
  paymentTypes,
};
