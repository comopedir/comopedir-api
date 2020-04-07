module.exports.up = async db => {
  await db.schema.createTable('category', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('slug', 100)
      .unique()
      .notNullable();
    table
      .integer('priority')
      .notNullable()
      .defaultTo(100);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('category');
};

module.exports.configuration = { transaction: true };
