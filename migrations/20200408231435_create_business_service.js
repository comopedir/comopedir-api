module.exports.up = async db => {
  await db.schema.createTable('business_service', table => {
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
      .uuid('service')
      .references('id')
      .inTable('service')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_service');
};

module.exports.configuration = { transaction: true };
