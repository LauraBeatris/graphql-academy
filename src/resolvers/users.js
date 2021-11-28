import { byQuery } from "./byQuery"

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockUsers = [
  {
    id: 1,
    name: 'JP',
    email: 'jp@example.com',
  },
  {
    id: 2,
    age: 15,
    name: 'Akos',
    email: 'akos@example.com',
  },
  {
    id: 3,
    age: 25,
    name: 'Juliet',
    email: 'juliet@example.com',
  }
]

const users = (_parent, args) => {
  const { query } = args 

  if (!query) return mockUsers 

  const filteredUsersByQuery = mockUsers.filter(({ name }) => (
    byQuery({ query, fields: [name] })
  ))

  return filteredUsersByQuery
}

export { users }
