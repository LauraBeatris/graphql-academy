import { byQuery } from "./byQuery"

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockPosts = [
  {
    id: 1,
    body: "Let's talk about Elixir LiveView",
    title: 'Elixir LiveView',
    isPublished: true,
  },
  {
    id: 2,
    body: 'How to provide query arguments to a GraphQL Operation',
    title: 'GraphQL Query Arguments',
    isPublished: false,
  },
  {
    id: 3,
    body: 'How to create a custom type in GraphQL',
    title: 'Custom types in GraphQL',
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

export { posts }
