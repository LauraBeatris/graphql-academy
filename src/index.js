import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  input RestaurantFilters {
    name: String!
  }

  type Query {
    id: ID!
    title: String!
    price: Int!
    rating: Float
    isInStock: Boolean!
    releaseYear: Int 
    listOfAuthors: [String!]!

    restaurants(filters: RestaurantFilters!): [String!]
  }
`

const resolvers = {
  Query: {
    id: () => 123,
    title: () => 'Playstation 5',
    price: () => '1.0',
    rating: () => '123.3',
    isInStock: () => false,
    releaseYear: () => undefined,
    listOfAuthors: () => ['Laura'],
    restaurants: () => ['Effendy Bakery']
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
  port: 8000
};

server.start(options, () => console.log(`GraphQL server running on port ${options.port}`));
