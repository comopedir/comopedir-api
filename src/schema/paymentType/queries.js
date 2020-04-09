import { GraphQLNonNull, GraphQLInt } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../services/db';
import PaymentType from './index';

const paymentTypes = {
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
  paymentTypes,
};
