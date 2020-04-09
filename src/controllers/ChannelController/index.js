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

  create: async (input) => {
    try {
      const channel = await db
        .table('channel')
        .insert({
          name: input.name,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { channel: { ...channel } };
    } catch (err) {
      return err;
    }
  },
  associate: async (input) => {
    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParam(
          'id', 
          fromGlobalId(input.business).id
        );
      }

      if (!business) throw new Error('Business not found.');

      let channel;

      if (input.channel) {
        channel = await ChannelController.getByParam(
          'id', 
          fromGlobalId(input.channel).id
        );        
      }

      if (!channel) throw new Error('Channel not found.');
      
      await db
        .table('business_channel')
        .where({
          business: business.id,
          channel: channel.id,
        })
        .del();

      const businessChannel = await db
        .table('business_channel')
        .insert({
          business: business.id,
          channel: channel.id,
          value: input.value,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { businessChannel: { ...businessChannel } };
    } catch (err) {
      return err;
    }
  },
};
export default ChannelController;
