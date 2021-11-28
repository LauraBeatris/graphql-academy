import { me, User, users } from './users'
import { posts } from './posts'
import { GraphQLEmailAddress } from '../scalars/EmailAddress'

const Query = {
  me,
  users,
  posts
}

const Scalars = {
  EmailAddress: GraphQLEmailAddress
}

const resolvers = {
  ...Scalars,
  Query,
  User
}

export { resolvers }
