import { dbClient } from './config'

export const getAllPosts = ({ take }: { take: number }) => (
  dbClient.post.findMany({ take })
)

export const getUserPosts = ({
  userId, take
}: { userId: string, take: number }) => (
  dbClient.user.findUnique({
    where: {
      id: userId
    }
  }).posts({ take })
)

export const getPostAuthor = ({ postId }: { postId: string }) => (
  dbClient.post.findUnique({
    where: {
      id: postId
    }
  }).author()
)
