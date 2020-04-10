module.exports.up = async db => {
  await db.schema.createTable('picture', table => {
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
      .integer('priority')
      .notNullable()
      .defaultTo(100);
    table.string('type', 100);
    table.string('description', 255);
    table.string('origin_id', 100);
    table
      .uuid('raw')
      .references('id')
      .inTable('picture_file');
    table
      .uuid('small')
      .references('id')
      .inTable('picture_file');
    table
      .uuid('large')
      .references('id')
      .inTable('picture_file');
    table.timestamps(true, true);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('picture');
};

module.exports.configuration = { transaction: true };
