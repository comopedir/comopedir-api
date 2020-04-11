import { GraphQLNonNull, GraphQLInt } from 'graphql';
import {
  connectionDefinitions,
  connectionFromArraySlice,
  forwardConnectionArgs,
  cursorToOffset,
} from 'graphql-relay';

import AccountType from '../account';
import db from '../../services/db';

const accounts = {
  type: connectionDefinitions({
    name: 'Account',
    nodeType: AccountType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(_root, args, ctx) {

    ctx.isAuthorized(['admin']);

    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const [data, totalCount] = await Promise.all([
      db
        .table('account')
        .limit(limit)
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.accountById.prime(x.id, x));
          return rows;
        }),
      db
        .table('account')
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
  accounts,
};
