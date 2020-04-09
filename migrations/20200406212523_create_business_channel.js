module.exports.up = async db => {
  await db.schema.createTable('business_channel', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('business')
      .references('id')
      .inTable('business')
      .notNullable();
    table
      .uuid('channel')
      .references('id')
      .inTable('channel')
      .notNullable();
    table.string('value', 100);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_channel');
};

module.exports.configuration = { transaction: true };
