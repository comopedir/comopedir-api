const role = ['guest', 'user', 'admin'];

module.exports.up = async knex =>
  knex.schema.createTable('role', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('account')
      .references('id')
      .inTable('account')
      .notNullable();
    table.enu('role', role).notNullable();
    table.timestamps(true, true);
  });

module.exports.down = knex => knex.schema.dropTableIfExists('role');

module.exports.configuration = { transaction: true };
