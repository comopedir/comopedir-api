exports.up = knex =>
  knex.schema.createTable('person', table => {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .notNullable()
      .primary();
    table
      .uuid('account')
      .notNullable()
      .references('id')
      .inTable('account');
    table.string('name').notNullable();
    table.date('birthdate').notNullable();
    table
      .string('cpf_cnpj')
      .unique()
      .notNullable();
    table.timestamps(true, true);
  });

exports.down = knex => knex.schema.dropTableIfExists('person');
