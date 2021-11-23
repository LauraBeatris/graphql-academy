import { GraphQLServer } from 'graphql-yoga'

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
const mockPosts = [
  {
    id: 1,
    body: "Let's talk about Elixir LiveView",
    title: 'Elixir LiveView',
    isPublished: true,
  },
  {
    id: 2,
    body: 'How to provide query arguments to a GraphQL Operation',
    title: 'GraphQL Query Arguments',
    isPublished: false,
  },
  {
    id: 3,
    body: 'How to create a custom type in GraphQL',
    title: 'Custom types in GraphQL',
    isPublished: true,
  }
]

const typeDefs = `
  type Query {
    me: User!
    posts(query: String): [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    body: String!
    title: String!
    isPublished: Boolean!
  }
`

/**
 * Returns boolean determining whether a post should 
 * be filtered by a given query string argument
 * 
 * @param {String} query
 * @param {String[]} fields  
 */
const byQuery = ({ query, fields }) => {
  const lowerCaseQuery = query.toLowerCase()

  return fields.some(
    (field => field.toLowerCase().includes(lowerCaseQuery))
  )
} 

const resolvers = {
  Query: {
    posts: (_parent, args, _ctx, _info) =>  {
      const { query } = args

      if (!query) return mockPosts 

      const filteredPostsByTitleAndBody = mockPosts.filter(({ title, body }) => (
        byQuery({ query, fields: [title, body] })
      ))

      return filteredPostsByTitleAndBody
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

const options = {
  port: 8000
}

server.start(options, () => console.log(`GraphQL server running on port ${options.port}`))
