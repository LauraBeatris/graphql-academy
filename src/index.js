import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    location: String!
    bio: String!
  }
`

const resolvers = {
  Query: {
    location: () => 'Diemen, Netherlands',
    bio: () => 'Software Developer'
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
  port: 8000
};

server.start(options, () => console.log(`GraphQL server running on port ${options.port}`));
