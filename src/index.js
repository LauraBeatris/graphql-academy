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

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockUsers = [
  {
    id: 1,
    name: 'JP',
    email: 'jp@example.com',
  },
  {
    id: 2,
    age: 15,
    name: 'Akos',
    email: 'akos@example.com',
  },
  {
    id: 3,
    age: 25,
    name: 'Juliet',
    email: 'juliet@example.com',
  }
]

const typeDefs = `
  type Query {
    me: User!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }

  type User {
    id: ID!
    age: Int
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
    users: (_parent, args, _ctx, _info) => {
      const { query } = args 

      if (!query) return mockUsers 

      const filteredUsersByQuery = mockUsers.filter(({ name }) => (
        byQuery({ query, fields: [name] })
      ))

      return filteredUsersByQuery
    },
    posts: (_parent, args, _ctx, _info) =>  {
      const { query } = args

      if (!query) return mockPosts 

      const filteredPostsByQuery = mockPosts.filter(({ title, body }) => (
        byQuery({ query, fields: [title, body] })
      ))

      return filteredPostsByQuery 
    },
  },
  User: {
    name: (parent, args, _ctx, _info) => `${parent.name} - Testing parent argument`
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

const options = {
  port: 8000
}

server.start(options, () => console.log(`GraphQL server running on port ${options.port}`))
