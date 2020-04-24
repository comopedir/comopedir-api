import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import { printSchema } from 'graphql';

import errors from './errors';
import schema from './schema';

import Context from './schema/context';
import authMiddleware from './middlewares/authMiddleware';

import gmaps from './services/gmaps';

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.set('trust proxy', 'loopback');
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));

app.use(authMiddleware);

app.get('/', (req, res) => {

  maps = new gmaps();

  res.type('text/plain').send('Olá :)');
  res.status(200);
});

app.get('/graphql/schema', (req, res) => {
  if (process.env.NODE_ENV !== 'production')
    res.type('text/plain').send(printSchema(schema));
});

app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    context: new Context(req),
    graphiql: process.env.NODE_ENV !== 'production',
    pretty: process.env.NODE_ENV !== 'production',
    customFormatErrorFn: (error) => {
      errors.report(error.originalError || error);
      return {
        message: error.message,
        code: error.originalError && error.originalError.code,
        state: error.originalError && error.originalError.state,
        locations: error.locations,
        path: error.path,
      };
    },
  })),
);

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
