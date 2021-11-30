import { byQuery } from "./byQuery"
import { mockUsers } from "./users"
import { mockComments } from "./comments"

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockPosts = [
  {
    id: 1,
    body: "Of course that Harry Potter is the best movie series ever.",
    title: 'What are your favorite movie series?',
    userId: 1,
    isPublished: true,
  },
  {
    id: 2,
    body: 'How to provide query arguments to a GraphQL Operation',
    title: 'GraphQL Query Arguments',
    userId: 2,
    isPublished: false,
  },
  {
    id: 3,
    body: 'How to create a custom type in GraphQL',
    title: 'Custom types in GraphQL',
    userId: 3,
    isPublished: true,
  }
]

const posts = (_parent, args) => {
  const { query } = args

  if (!query) return mockPosts 

  const filteredPostsByQuery = mockPosts.filter(({ title, body }) => (
    byQuery({ query, fields: [title, body] })
  ))

  return filteredPostsByQuery 
}

const Post = {
  author: (parent) => mockUsers.find(({ id }) => id === parent.userId),
  comments: (parent) => mockComments.filter(({ postId }) => postId === parent.id)
}

export { 
  Post, 
  posts, 
  mockPosts 
}
