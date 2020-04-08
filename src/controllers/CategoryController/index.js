import db from '../../services/db';

const CategoryController = {
  getByParam: async (key, value) =>
    db
      .table('category')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input) => {
    try {
      const category = await db
        .table('category')
        .insert({
          slug: input.slug,
          priority: input.priority,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { category: { ...category } };
    } catch (err) {
      return err;
    }
  },
};
export default CategoryController;
