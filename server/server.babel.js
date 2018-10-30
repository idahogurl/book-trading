import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { ApolloServer } from 'apollo-server';

import fs from 'fs';
// import getUser from './getUser';
import resolvers from './graphql/resolvers';
import processLogin from './login';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const app = express();

const port = process.env.PORT || 8080;
const apolloPort = process.env.APOLLO_PORT || 4000;

const options =
  env === 'development'
    ? {
      key: fs.readFileSync('./localhost.key'),
      cert: fs.readFileSync('./localhost.cert'),
      requestCert: false,
      rejectUnauthorized: false,
    }
    : {};

const server = https.createServer(options, app);

app.use('/', express.static('public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = fs.readFileSync(path.resolve(__dirname, 'graphql/schema.gql'), 'utf8');

const apolloServer = new ApolloServer({ typeDefs, resolvers });

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

apolloServer.listen().then(() => {
  console.log(`Apollo Server Started at port ${apolloPort}`);
});

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
