import { createYoga, createSchema } from 'graphql-yoga';
import resolvers from '../../server/graphql/resolvers';
import typeDefs from '../../server/graphql/schema.gql';

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  // defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
});
