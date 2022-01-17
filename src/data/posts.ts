import { dbClient } from './config'

export const getAllPosts = ({ take }: { take: number }) => (
  dbClient.post.findMany({ take })
)

export const getUserPosts = ({
  userId, take
}: { userId: string, take: number }) => (
  dbClient.post.findMany({
    where: {
      authorId: userId
    },
    take
  })
)

export const getPostAuthor = ({ postId }: { postId: string }) => (
  dbClient.post.findUnique({
    where: {
      id: postId
    }
  }).author()
)
