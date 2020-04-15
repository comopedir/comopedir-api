module.exports.up = async db => {
  await db.schema.createTable('channel', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('name', 100).notNullable();
    table.string('slug', 100)
    .unique()
    .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('channel');
};

module.exports.configuration = { transaction: true };
