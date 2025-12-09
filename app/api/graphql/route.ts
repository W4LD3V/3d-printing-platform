import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';
import { buildContext } from '@/lib/graphql/context';

const { handleRequest } = createYoga({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({ typeDefs, resolvers }),
  fetchAPI: { Request, Response },
  context: ({ request }) => buildContext(request)
});

export { handleRequest as GET, handleRequest as POST };
