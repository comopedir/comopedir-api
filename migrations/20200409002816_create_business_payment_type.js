module.exports.up = async db => {
  await db.schema.createTable('business_payment_type', table => {
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
      .uuid('payment_type')
      .references('id')
      .inTable('payment_type')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_payment_type');
};

module.exports.configuration = { transaction: true };
