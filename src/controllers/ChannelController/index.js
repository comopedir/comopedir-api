import db from '../../services/db';

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
};
export default ChannelController;
