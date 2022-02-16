import { NotFoundError } from 'errors'
import { OffsetPaginationArgs } from 'graphql/schema/types/pagination'
import { dbClient } from './config'

export const getAllComments = ({ take, skip }: OffsetPaginationArgs) => (
  dbClient.comment.findMany({ take, skip })
)

export const getPostComments = ({
  postId, take, skip
}: { postId: string } & OffsetPaginationArgs) => (
  dbClient.post.findUnique({
    where: {
      id: postId
    }
  }).comments({ take, skip })
)

export const getCommentAuthor = ({ commentId }: { commentId: string }) => (
  dbClient.comment.findUnique({
    where: {
      id: commentId
    }
  }).author()
)

export const createComment = async ({ text, postId, authorId }: {
  text: string;
  postId: string;
  authorId: string;
}) => {
  const post = await dbClient.post.findUnique({
    where: {
      id: postId
    }
  })
  if (!post) {
    throw new NotFoundError({
      path: ['createComment'],
      message: 'Not able to find a post with the postId provided.'
    })
  }

  const author = await dbClient.user.findUnique({
    where: {
      id: authorId
    }
  })
  if (!author) {
    throw new NotFoundError({
      path: ['createComment'],
      message: 'Not able to find an user with the authorId provided.'
    })
  }

  return dbClient.comment.create({
    data: {
      text,
      postId,
      authorId
    }
  })
}

export const deleteComment = async ({ id }: { id: string }) => {
  const comment = await dbClient.comment.findUnique({
    where: {
      id
    }
  })

  if (!comment) {
    throw new NotFoundError({
      path: ['deleteComment'],
      message: 'Comment not found'
    })
  }

  return dbClient.comment.delete({ where: { id } })
}
