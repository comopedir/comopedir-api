module.exports.up = async db => {
  await db.schema.createTable('service_translation', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('service')
      .references('id')
      .inTable('service')
      .notNullable();
    table
      .uuid('translation')
      .references('id')
      .inTable('translation')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('service_translation');
};

module.exports.configuration = { transaction: true };
