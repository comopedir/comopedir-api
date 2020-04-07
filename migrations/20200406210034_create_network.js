module.exports.up = async db => {
  await db.schema.createTable('network', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('slug', 100)
      .unique()
      .notNullable();
    table.string('name', 100).notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('network');
};

module.exports.configuration = { transaction: true };
