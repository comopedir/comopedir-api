module.exports.up = async db => {
  await db.schema.createTable('business', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('network')
      .references('id')
      .inTable('network');
    table.string('slug', 100)
      .unique()
      .notNullable();
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business');
};

module.exports.configuration = { transaction: true };
