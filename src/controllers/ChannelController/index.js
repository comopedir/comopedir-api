import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import BusinessController from '../BusinessController';

const ChannelController = {
  getByParam: async (key, value) =>
    db
      .table('channel')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),
  
  getByParamWithTransaction: async (key, value, TransactionDB) =>
    db
      .table('channel')
      .transacting(TransactionDB)
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const channel = await db
        .table('channel')
        .insert({
          name: input.name,
          slug: input.slug,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { channel: { ...channel } };
    } catch (err) {
      return err;
    }
  },

  associateChannel: async (business, channelId, value, trx) => {
    try {
      const channel = await ChannelController.getByParamWithTransaction(
        'id', 
        fromGlobalId(channelId).id,
        trx,
      );

      if (!channel) throw new Error('Channel not found.');

      await db
        .table('business_channel')
        .transacting(trx)
        .insert({
          business: business.id,
          channel: channel.id,
          value,
        })
        .returning('*')
        .then(rows => rows[0]);

      return Promise.resolve('ok');
    }
    catch (err) {
      console.error('Problem associating business / channel.');
    }
  },

  associate: async (input) => {
    const trx = await db.transaction();

    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParamWithTransaction(
          'id', 
          fromGlobalId(input.business).id,
          trx
        );
      }

      if (!business) throw new Error('Business not found.');
      if (!input.channels) throw new Error('Channels not found.');

      await db
        .table('business_channel')
        .transacting(trx)
        .where({
          business: business.id,
        })
        .del();

      await Promise.all(
        input.channels.map(
          channelData => ChannelController.associateChannel(business, channelData[0], channelData[1], trx)
        )
      );

      const businessChannel = await db
        .table('business_channel')
        .transacting(trx)
        .where({
          business: business.id,
        });

      await trx.commit();

      return { businessChannel: { ...businessChannel } };
    } catch (err) {
      await trx.rollback();
      return err;
    }
  },
};
export default ChannelController;
