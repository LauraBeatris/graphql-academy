import { mockUsers } from "./users"

/**
 * @todo - Remove after fetching from external source. Eg: Database.
 */
 const mockComments = [
  {
    id: 1,
    text: 'Lord of the rings is the best movie series ever.',
    userId: 1,
  },
  {
    id: 2,
    text: "I don't think so... Spider Man is better",
    userId: 2,
 },
  {
    id: 3,
    text: 'What are you saying??',
    userId: 1
  }
]

const comments = () => mockComments

const Comment = {
  author: (parent) => mockUsers.find(({ id }) => id === parent.userId) 
}

export { 
  Comment,
  comments, 
  mockComments 
}
