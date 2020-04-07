import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  seeds: {
    directory: './seeds',
  },
  debug: false,
  migrations: {
    directory: './migrations',
    tableName: 'migrations',
  },
  pool: {
    min: 2,
    max: 400,
    propagateCreateError: false,
  },
});

export default db;
