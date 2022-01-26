import { BadRequestError, NotFoundError } from 'errors'
import { Post } from 'graphql/schema/types/post'
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
  const author = await dbClient.user.findUnique({
    where: {
      id: authorId
    }
  })
  if (!author) {
    throw new NotFoundError({
      path: ['createPost'],
      message: 'Not able to find an user with the authorId provided.'
    })
  }

  const existingPost = await dbClient.post.findUnique({
    where: {
      title
    }
  })

  if (existingPost) {
    throw new BadRequestError({
      message: 'Post title provided is already taken.',
      metadata: {
        postTitleWasTaken: true
      }
    })
  }

  return dbClient.post.create({
    data: {
      title,
      authorId,
      description,
      isPublished: false
    }
  })
}

export const deletePost = async ({ id }: { id: string }) => {
  const post = await dbClient.post.findUnique({
    where: { id }
  })

  if (!post) {
    throw new NotFoundError({
      path: ['deletePost'],
      message: 'Post not found'
    })
  }

  return dbClient.post.delete({ where: { id } })
}

type UpdatePostData = Partial<Omit<Post, 'id' | 'authorId' | 'author' | 'comments'>>
export const updatePost = async (id: string, data: UpdatePostData) => {
  const post = await dbClient.post.findUnique({
    where: { id }
  })

  if (!post) {
    throw new NotFoundError({
      path: ['updatePost'],
      message: 'Post not found'
    })
  }

  const updatedPost = await dbClient.post.update({
    data,
    where: { id }
  })

  return updatedPost
}
