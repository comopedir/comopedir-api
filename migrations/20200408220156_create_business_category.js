module.exports.up = async db => {
  await db.schema.createTable('business_category', table => {
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
      .uuid('category')
      .references('id')
      .inTable('category')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_category');
};

module.exports.configuration = { transaction: true };
