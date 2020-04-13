import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import airtable from '../../services/airtable';
import AirtableBusinessType from './index';

let atb = new airtable();

const airtableBusiness = {
  type: AirtableBusinessType,
  args: {
    airtableId: {
      type: GraphQLString,
    },
  },
  async resolve(_root, args, context) {
    const { airtableId } = args;

    let business;

    const [data] = await Promise.all([
      atb
        .getTableContents()
        .then(rows => {
          rows.forEach(record => {

            if (record['airtableID'] === airtableId) {
              business = {
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
                city: record['Cidade'],
                instagram: record['Instagram'],
                email: record['Email'],
                approved: record['Aprovado?'],
                pictures: record['Foto da Comida'],
              };
            }

            return record;
          });

          return business;
        })]);

    return data;
  },
};

const airtableBusinesses = {
  type: connectionDefinitions({
    name: 'ExternalTable',
    nodeType: AirtableBusinessType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(_root, args, _ctx) {
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
              city: record['Cidade'],
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
  airtableBusiness,
  airtableBusinesses,
};
