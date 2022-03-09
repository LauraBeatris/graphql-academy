import 'dotenv/config'
import 'reflect-metadata'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import { ApolloServer } from 'apollo-server'
import { GraphQLSchema, lexicographicSortSchema } from 'graphql'
import { buildSchemaSync } from 'type-graphql'
import { outputFile } from 'type-graphql/dist/helpers/filesystem'
import { resolve } from 'path'

import { CommentResolver, MarketingPostResolver, PostResolver, UserResolver } from './graphql/resolvers'

const schema = buildSchemaSync({
  resolvers: [UserResolver, CommentResolver, PostResolver, MarketingPostResolver]
})

/**
 * Currently TypeGraphQL does not directly support emitting the schema
 * with custom directives due to printSchema function limitations from graphql-js
 *
 * In order to emit a schema with custom directives, it's needed to create a custom function
 * that uses a third-party printSchema functionally, such as `printSchemaWithDirectives` from `@graphql-tools/utils`
 * @see https://typegraphql.com/docs/emit-schema.html#emit-schema-with-custom-directives
 */
const emitSchemaDefinitionWithCustomDirectives = (
  schemaFilePath: string,
  schema: GraphQLSchema
) => {
  const schemaFileContent = printSchemaWithDirectives(lexicographicSortSchema(schema))
  return outputFile(schemaFilePath, schemaFileContent)
}
emitSchemaDefinitionWithCustomDirectives(resolve(__dirname, '__generated__/graphql/schema.gql'), schema)

const server = new ApolloServer({
  schema
})

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
