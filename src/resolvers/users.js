import { byQuery } from "./byQuery"

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockUsers = [
  {
    id: 1,
    name: 'JP',
  },
  {
    id: 2,
    age: 15,
    name: 'Akos',
 },
  {
    id: 3,
    age: 25,
    name: 'Juliet',
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

const me = () => mockUsers[0]

const User = {
  email: (parent) => `${parent.name.toLowerCase()}@example.com`
}

export { 
  me, 
  User, 
  users, 
  mockUsers 
}
