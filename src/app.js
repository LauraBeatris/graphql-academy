import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const schema = makeExecutableSchema({ typeDefs, resolvers })
const app = express()

app.use('/graphql', graphqlHTTP(() => ({
  schema,
  graphiql: true
})))

export { app }
