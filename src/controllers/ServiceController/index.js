import db from '../../services/db';

const ServiceController = {
  getByParam: async (key, value) =>
    db
      .table('service')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const service = await db
        .table('service')
        .insert({
          slug: input.slug,
          priority: input.priority,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { service: { ...service } };
    } catch (err) {
      return err;
    }
  },
};
export default ServiceController;
