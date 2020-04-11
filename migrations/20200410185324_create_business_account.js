module.exports.up = async db => {
  await db.schema.createTable('business_account', table => {
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
      .uuid('account')
      .references('id')
      .inTable('account')
      .notNullable();
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('business_account');
};

module.exports.configuration = { transaction: true };
