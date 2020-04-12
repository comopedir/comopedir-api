import { GraphQLNonNull, GraphQLInt } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import airtable from '../../services/airtable';
import ExternalTableType from './index';

let atb = new airtable();

const airtableBusinesses = {
  type: connectionDefinitions({
    name: 'ExternalTable',
    nodeType: ExternalTableType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(_root, args, ctx) {
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;
    const [data, totalCount] = await Promise.all([
      atb
        .getTableContents()
        .then(rows => {
          const businesses = [];
          rows.forEach(record => {
            businesses.push({
              id: record['airtableID'],
              airtableId: record['airtableID'],
              name: record['Nome do Estabelecimento'],
              services: record['Serviços'],
              channels: record['Como Pedir'],
              categories: record['Categoria'],
              website: record['Website'],
              whatsapp: record['whatsapp'],
              phone: record['Telefone para Pedidos'],
              state: record['Estado'],
              city: record['Cidade:'],
              instagram: record['Instagram'],
              email: record['Email'],
              approved: record['Aprovado?'],
              pictures: record['Foto da Comida'],
            });

            return record;
          });

          return businesses;
        }),
      atb
        .getTableContents()
        .then(rows => rows.length),
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
  airtableBusinesses,
};
