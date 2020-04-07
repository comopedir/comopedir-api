module.exports.up = async db => {
  await db.schema.createTable('category_translation', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('category')
      .references('id')
      .inTable('category')
      .notNullable();
    table
      .uuid('translation')
      .references('id')
      .inTable('translation')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('category_translation');
};

module.exports.configuration = { transaction: true };
