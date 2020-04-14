module.exports.up = async knex =>
  knex.schema.alterTable('business', table => {
    table.string('airtable_id', 100);
  });

module.exports.down = knex =>
  knex.schema.alterTable('business', table => {
    table.dropColumn('airtable_id');
  });
module.exports.configuration = { transaction: true };
