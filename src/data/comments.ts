import { dbClient } from './config'

export const getAllComments = ({ take }: { take: number }) => (
  dbClient.comment.findMany({ take })
)

export const getPostComments = ({
  postId, take
}: { postId: string, take: number }) => (
  dbClient.post.findUnique({
    where: {
      id: postId
    }
  }).comments({ take })
)

export const getCommentAuthor = ({ commentId }: { commentId: string }) => (
  dbClient.comment.findUnique({
    where: {
      id: commentId
    }
  }).author()
)
