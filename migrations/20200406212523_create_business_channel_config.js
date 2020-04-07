module.exports.up = async db => {
  await db.schema.createTable('business_channel_config', table => {
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
    table.string('config', 100);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_channel_config');
};

module.exports.configuration = { transaction: true };
