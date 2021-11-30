import { posts, Post } from './posts'
import { me, users, User } from './users'
import { comments, Comment } from './comments'
import { GraphQLEmailAddress } from '../scalars/EmailAddress'

const Query = {
  me,
  users,
  posts,
  comments
}

const Scalars = {
  EmailAddress: GraphQLEmailAddress
}

const resolvers = {
  ...Scalars,
  Query,
  User,
  Post,
  Comment
}

export { resolvers }
