module.exports.up = async db => {
  await db.schema.createTable('payment_type_translation', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('payment_type')
      .references('id')
      .inTable('payment_type')
      .notNullable();
    table
      .uuid('translation')
      .references('id')
      .inTable('translation')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('payment_type_translation');
};

module.exports.configuration = { transaction: true };
