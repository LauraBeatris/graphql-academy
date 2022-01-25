import { CreatePostSuccess, DeletePostSuccess, PostTitleTakenError } from 'graphql/resolvers/post'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { Post } from 'graphql/schema/types/post'
import { UserError } from 'graphql/schema/types/userError'
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
    where: { id }
  })

  if (!post) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      path: ['post', 'id'],
      message: 'Post not found'
    })
  }

  return Object.assign(new DeletePostSuccess(), {
    post: await dbClient.post.delete({ where: { id } })
  })
}

type UpdatePostData = Partial<Omit<Post, 'id' | 'authorId' | 'author' | 'comments'>>
export const updatePost = async (id: string, data: UpdatePostData) => {
  const post = await dbClient.post.findUnique({
    where: { id }
  })

  if (!post) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      path: ['post', 'id'],
      message: 'Post not found'
    })
  }

  const updatedPost = await dbClient.post.update({
    data,
    where: { id }
  })

  return updatedPost
}
