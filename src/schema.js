
const typeDefs = `
scalar EmailAddress

type Query {
  me: User!
  users(query: String): [User!]!
  posts(query: String): [Post!]!
}

type User {
  id: ID!
  age: Int
  name: String!
  email: EmailAddress!
}

type Post {
  id: ID!
  body: String!
  title: String!
  isPublished: Boolean!
}
`

export { typeDefs }
