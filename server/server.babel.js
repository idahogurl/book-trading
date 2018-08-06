import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import getUser from './getUser';
import resolvers from './graphql/resolvers';
import processLogin from './login';
import goodReadsRequest from './goodreads';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const app = express();

const port = process.env.PORT || 8080;
const options = env === 'development' ? {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt'),
  requestCert: false,
  rejectUnauthorized: false,
} : {};

const server = https.createServer(options, app);

app.use('/', express.static('public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const typeDefs = fs.readFileSync(path.resolve(__dirname, 'graphql/schema.gql'), 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', getUser, graphqlExpress(req => ({ context: req.user, schema })));
app.get('/graphiql', getUser, graphiqlExpress({
  endpointURL: '/graphql',
}));

app.post('/auth/facebook', (req, res, next) => {
  processLogin(req, res, next);
});

app.use('/logout', (req, res, next) => {
  if (req.signedCookies.token) {
    res.clearCookie('token');
  }
  next();
});

app.post('/goodreads', (req, res, next) => {
  goodReadsRequest(req, res, next);
});

// Always return the main index.html, so react-router renders the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
