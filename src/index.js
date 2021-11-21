import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  input RestaurantFilters {
    name: String!
  }

  type Query {
    add(num1: Float!, num2: Float!): Float!
    post: Post!
    restaurants(filters: RestaurantFilters!): [String!]
    User: User!
  }

  type Post {
    id: ID!
    body: String!
    title: String!
    test: Int,
    isPublished: Boolean!
  }
`

const resolvers = {
  Query: {
    add: (parent, { num1, num2 }, context, info) => {
      console.log({ parent, context, info })

      return num1 + num2
    },
    post: () => ({ 
      id: 123, 
      body: 'This is my post body', 
      title: 'My dumb post', 
      test: '123',
      isPublished: false
    }),
    restaurants: () => ['Effendy Bakery']
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

const options = {
  port: 8000
};

server.start(options, () => console.log(`GraphQL server running on port ${options.port}`));
