import { users } from './users'
import { posts } from './posts'
import { GraphQLEmailAddress } from '../scalars/EmailAddress'

const Query = {
  users,
  posts,
}

const Scalars = {
  EmailAddress: GraphQLEmailAddress
}

const resolvers = {
  ...Scalars,
  Query
}

export { resolvers }
