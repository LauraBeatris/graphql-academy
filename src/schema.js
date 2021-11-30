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
      type: getNonNullListType(Post)
    },
    comments: {
      type: getNonNullListType(Comment)
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

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: "A user's comment",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    text: {
      type: new GraphQLNonNull(GraphQLString)
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
      },
      comments: {
        type: getNonNullListType(Comment)
      }
    }
  })
})

export { typeDefs }
