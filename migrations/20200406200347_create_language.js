module.exports.up = knex =>
  knex.schema.createTable('language', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('iso_code').notNullable();
    table.string('name', 100).notNullable();
  });

module.exports.down = knex => knex.schema.dropTableIfExists('language');

module.exports.configuration = { transaction: true };