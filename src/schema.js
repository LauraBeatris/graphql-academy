import gql from 'graphql-tag'

const typeDefs = gql`
  scalar EmailAddress

  type Query {
    me: User! 
    posts: [Post!]
    users: [User!]
    comments: [Comment!] 
  }

  """
  A type that describes the user. 
  """
  type User {
    id: ID!
    age: Int
    name: String! 
    posts: [Post!]
    comments: [Comment!]
    email: EmailAddress!
  }

  """
  A type that describes a user's post. 
  """
  type Post {
    id: ID!
    body: String!
    title: String!
    author: User! 
    isPublished: Boolean!
    comments: [Comment!]
  }

  """
  A type that describes a user's comment. 
  """
  type Comment {
    id: ID!
    text: String! 
    post: Post!
    author: User! 
  }
`

export { typeDefs }
