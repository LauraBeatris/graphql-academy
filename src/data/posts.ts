import { CreatePostSuccess, DeletePostSuccess, PostTitleTakenError } from 'graphql/resolvers/Post.resolver'
import { ErrorCode, UserError } from 'graphql/schema/UserError.schema'
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

export const createPost = async ({
  title, description, authorId
}: {
  title: string;
  authorId: string;
  description: string;
}) => {
  const existingPost = await dbClient.post.findUnique({
    where: {
      title
    }
  })

  if (existingPost) {
    return Object.assign(new PostTitleTakenError(), {
      code: ErrorCode.BAD_REQUEST,
      message: "There's an existing post with the provided title.",
      postTitleWasTaken: true
    })
  }

  return Object.assign(new CreatePostSuccess(), {
    post: await dbClient.post.create({
      data: {
        title,
        authorId,
        description,
        isPublished: false
      }
    })
  })
}

export const deletePost = async ({ id }: { id: string }) => {
  const post = await dbClient.post.findUnique({
    where: {
      id
    }
  })

  if (!post) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      message: 'Post not found'
    })
  }

  return Object.assign(new DeletePostSuccess(), {
    post: await dbClient.post.delete({ where: { id } })
  })
}
