# Como Pedir - Graphql API

This repo contains a **data API** backend using **[Node.js][node]**
and **[GraphQL][gql]** for **Como pedir** API.

## Tech Stack

* [Node.js][node], [Yarn][yarn], [TypeScript][ts], [Babel][babel]
* [GraphQL.js][gqljs], [GraphQL.js Relay][gqlrelay], [DataLoader][loader], [Yup][yup] — [GraphQL][gql] schema and API endpoint
* [PostgreSQL][pg], [Knex][knex], [pg][nodepg] — data access and db automation (migrations, seeds)

## Prerequisites

* [Node.js][node] v10 + [Yarn][yarn] package manager (**Actually with problems using node v13**)
* [PostgreSQL][pg] (can be local or remote instance

## Getting Started

Just clone the repo, tweak `.env` file in the root of the project, and run `yarn start`:

```bash
$ git clone https://github.com/comopedir/comopedir-api comopedir-api
$ cd comopedir-api                # Change current directory to the newly created one
$ yarn install                    # Install Node.js dependencies
$ yarn start                      # Launch Node.js API application. Or, yarn start --env=local
```

The API server must become available at [http://localhost:8080/graphql](http://localhost:8080/graphql).

For non-production enviroments, the endpoint will show the GraphiQL IDE interface to
navigate inside API.

### How to Migrate Database Schema

While the app is in development, you can use a simplified migration workflow by
creating a local copy of the database, making changes to the existing
migration files (see `migrations/` folder), re-apply the
migration and run the knex commands to create or update database structure:

```bash
$ knex:migrate latest           # Will run the scripts until the latest migration
```

**Tip:** Use `knex:migrate` without parameters to see entire knex working flow
for migrations.

---

This project is inspired in some architectural aspects from 
[Node.js API Starter Kit](https://github.com/kriasoft/nodejs-api-starter), 
using some code of the original project. 

[node]: https://nodejs.org
[ts]: https://typescriptlang.org/
[babel]: http://babeljs.io/
[gql]: http://graphql.org/
[gqljs]: https://github.com/graphql/graphql-js
[gqlrelay]: https://github.com/graphql/graphql-relay-js
[yarn]: https://yarnpkg.com
[pg]: https://www.postgresql.org/
[nodepg]: https://github.com/brianc/node-postgres
[knex]: http://knexjs.org/
[loader]: https://github.com/facebook/dataloader
[yup]: https://github.com/jquense/yup
