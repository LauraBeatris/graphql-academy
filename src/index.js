import { GraphQLServer } from 'graphql-yoga'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const server = new GraphQLServer({ typeDefs, resolvers })
const options = {
  port: 8000
}
server.start(options, () => console.log(`GraphQL server running on port ${options.port}`))
