module.exports.up = async db => {
  await db.schema.createTable('picture_file', table => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('url', 255).notNullable();
    table
      .integer('size');
    table
      .integer('width');
    table
      .integer('height');
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('picture_file');
};

module.exports.configuration = { transaction: true };
