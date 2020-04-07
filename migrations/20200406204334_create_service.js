module.exports.up = async db => {
  await db.schema.createTable('service', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('slug', 100).notNullable();
    table
      .integer('priority')
      .notNullable()
      .defaultTo(100);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('service');
};

module.exports.configuration = { transaction: true };
