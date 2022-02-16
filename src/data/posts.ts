import { BadRequestError, NotFoundError } from 'errors'
import { ConnectionArgs, OffsetPaginationArgs } from 'graphql/schema/types/pagination'
import { Post } from 'graphql/schema/types/post'
import { dbClient } from './config'

export const getAllPosts = ({ after, first }: ConnectionArgs) => {
  /**
   * If there's no cursor, this means that this is the first requests,
   * and we will return the first items in the database
   */
  const isFirstRequest = !after
  if (isFirstRequest) {
    return dbClient.post.findMany({
      take: first,
      skip: 1,
      cursor: {
        id: after
      }
    })
  } else {
    return dbClient.post.findMany({
      take: first
    })
  }
}

export const getUserPosts = ({
  userId, take, skip
}: { userId: string } & OffsetPaginationArgs) => (
  dbClient.user.findUnique({
    where: {
      id: userId
    }
  }).posts({ take, skip })
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
