import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.NODE_ENV === 'production' ? 'https://book-trading.vercel.app' : 'http://localhost:3000'}/api/graphql`,
  cache: new InMemoryCache(),
});

export default client;
