import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';

import { GraphQLEmailAddress } from './scalars/EmailAddress';

const getNonNullListType = (type) => (
  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)))
)

const User = new GraphQLObjectType({
  name: 'User',
  description: 'A application user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    age: {
      type: GraphQLInt
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLEmailAddress)
    },
    posts: {
      type: new GraphQLList(new GraphQLNonNull(Post))
    }
  })
})

const Post = new GraphQLObjectType({
  name: 'Post',
  description: "A user's post",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    body: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    isPublished: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    author: {
      type: new GraphQLNonNull(User)
    }
  }
})

const typeDefs = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      me: {
        type: new GraphQLNonNull(User)
      },
      users: {
        type: getNonNullListType(User),
        args: {
          query: GraphQLString
        }
      },
      posts: {
        type: getNonNullListType(Post),
        args: {
          query: GraphQLString
        }
      }
    }
  })
})

export { typeDefs }
