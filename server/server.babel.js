import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import path from 'path';
import graphqlHTTP from 'express-graphql';
import gql from 'graphql-tag';
import { buildASTSchema } from 'graphql';
import fs from 'fs';
import resolvers from './graphql/resolvers';
import processLogin from './login';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const app = express();

const port = process.env.PORT || 8080;

const options =
  env === 'development'
    ? {
      key: fs.readFileSync('./localhost.key'),
      cert: fs.readFileSync('./localhost.cert'),
      requestCert: false,
      rejectUnauthorized: false,
    }
    : {};

const server = env === 'development' ? https.createServer(options, app) : http.createServer(options, app);

app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = fs.readFileSync(path.resolve(__dirname, 'graphql/schema.gql'), 'utf8');
const schema = buildASTSchema(gql`${typeDefs}`);
app.use('/graphql', graphqlHTTP({ schema, resolvers }));

app.post('/auth/facebook', (req, res, next) => {
  processLogin(req, res, next);
});

app.use('/logout', (req, res, next) => {
  if (req.signedCookies.token) {
    res.clearCookie('token');
  }
  next();
});

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
