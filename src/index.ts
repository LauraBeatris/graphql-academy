import 'dotenv/config'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { buildSchemaSync } from 'type-graphql'

import { UserResolver } from './graphql/resolvers'

const server = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [UserResolver]
  })
})

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
