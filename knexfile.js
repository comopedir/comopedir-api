/* eslint-disable no-undef */
const path = require('path');
const dotenv = require('dotenv');

// ⛔ IMPORTANT !!!! -------------
// Local switch to execute DB seed / migrations between ambients
const DB_ENVIROMENT = 'local';
// IMPORTANT !!!! -------------

dotenv.config({ path: path.resolve(process.cwd(), `.env.${DB_ENVIROMENT}`) });

module.exports = {
  local: {
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
      max: 30,
      propagateCreateError: false,
    },
  },
  development: {
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
      max: 30,
      propagateCreateError: false,
    },
  },
  staging: {
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
      max: 30,
      propagateCreateError: false,
    },
  },
  production: {
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
      max: 30,
      propagateCreateError: false,
    },
  },
};
