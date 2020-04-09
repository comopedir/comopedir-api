import db from '../../services/db';

const NetworkController = {
  getByParam: async (key, value) =>
    db
      .table('network')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const network = await db
        .table('network')
        .insert({
          slug: input.slug,
          name: input.name,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { network: { ...network } };
    } catch (err) {
      return err;
    }
  },
};
export default NetworkController;
