import { CreateCommentSuccess, DeleteCommentSuccess } from 'graphql/resolvers/comment'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { UserError } from 'graphql/schema/types/userError'
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
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      path: ['comment', 'post', 'id'],
      message: 'Not able to find a post with the postId provided.'
    })
  }

  const author = await dbClient.user.findUnique({
    where: {
      id: authorId
    }
  })
  if (!author) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      path: ['comment', 'user', 'id'],
      message: 'Not able to find an user with the authorId provided.'
    })
  }

  return Object.assign(new CreateCommentSuccess(), {
    comment: await dbClient.comment.create({
      data: {
        text,
        postId,
        authorId
      }
    })
  })
}

export const deleteComment = async ({ id }: { id: string }) => {
  const comment = await dbClient.comment.findUnique({
    where: {
      id
    }
  })

  if (!comment) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      path: ['comment', 'id'],
      message: 'Comment not found'
    })
  }

  return Object.assign(new DeleteCommentSuccess(), {
    comment: await dbClient.comment.delete({ where: { id } })
  })
}
