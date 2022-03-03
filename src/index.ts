import 'dotenv/config'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { buildSchemaSync } from 'type-graphql'

import { CommentResolver, MarketingPostResolver, PostResolver, UserResolver } from './graphql/resolvers'

const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver, CommentResolver, PostResolver, MarketingPostResolver]
  })
})

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
