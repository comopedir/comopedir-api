exports.up = knex =>
  knex.schema.createTable('address', table => {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .notNullable()
      .primary();
    table
      .uuid('business')
      .references('id')
      .inTable('business')
      .notNullable();
    table
      .boolean('current')
      .notNullable()
      .defaultTo(true);
    table.string('country');
    table.string('state');
    table.string('city');
    table.string('district');
    table.string('street');
    table.string('street_number');
    table.string('complement');
    table.string('zip_code');
    table.float('latitude', 4, 17);
    table.float('longitude', 4, 17);
    table.timestamps(true, true);
  });

exports.down = knex => knex.schema.dropTableIfExists('address');
