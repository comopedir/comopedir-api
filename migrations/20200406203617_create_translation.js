module.exports.up = knex => {
  return knex.schema.createTable('translation', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('language')
      .references('id')
      .inTable('language')
      .notNullable();
    table.string('name').notNullable();
    table.text('description');
  });
};

module.exports.down = knex => knex.schema.dropTableIfExists('translation');

module.exports.configuration = { transaction: true };
