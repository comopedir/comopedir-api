module.exports.up = knex => {
  const status = ['active', 'pending', 'disabled'];

  return knex.schema.createTable('account', table => {
    table
      .uuid('id')
      .defaultTo(knex.raw('uuid_generate_v1mc()'))
      .notNullable()
      .primary();
    table
      .bigInteger('phone_number', 12)
      .unique();
    table.bigInteger('phone_country_code', 2);
    table.bigInteger('phone_area_code', 2);
    table.string('username').unique();
    table.string('email').unique();
    table.string('password');
    table.string('code', 6);
    table
      .enu('status', status)
      .defaultTo('pending')
      .notNullable();
    table.timestamps(true, true);
  });
};

module.exports.down = knex => knex.schema.dropTableIfExists('account');

module.exports.configuration = { transaction: true };
