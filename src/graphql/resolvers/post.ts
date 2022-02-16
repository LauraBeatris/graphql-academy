import { handleResolverError } from 'errors'
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { createPost, deletePost, getAllPosts, getPostAuthor, updatePost } from 'data/posts'
import { OffsetPaginationArgs } from 'graphql/schema/types/pagination'
import { Comment } from 'graphql/schema/types/comment'
import { CreatePostInput, CreatePostPayload, CreatePostSuccess, DeletePostInput, DeletePostPayload, DeletePostSuccess, Post, PostTitleTakenError, PublishPostInput, PublishPostPayload, PublishPostSuccess, UnpublishPostInput, UnpublishPostPayload, UnpublishPostSuccess } from 'graphql/schema/types/post'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts (@Args() { take, skip }: OffsetPaginationArgs) {
    return getAllPosts({ take, skip })
  }

  @FieldResolver(() => [Comment], { nullable: 'itemsAndList' })
  comments (
    @Root() { id: postId }: Post,
    @Args() { take, skip }: OffsetPaginationArgs
  ) {
    return getPostComments({ postId, take, skip })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: postId }: Post
  ) {
    return getPostAuthor({ postId })
  }

  @Mutation(() => CreatePostPayload)
  async createPost (@Arg('data') { title, authorId, description }: CreatePostInput) {
    try {
      return Object.assign(new CreatePostSuccess(), {
        post: await createPost({ title, authorId, description })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const {
          code,
          path,
          message,
          metadata: { postTitleWasTaken }
        } = error

        if (postTitleWasTaken) {
          return Object.assign(new PostTitleTakenError(), {
            code,
            message,
            postTitleWasTaken
          })
        }

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }

  @Mutation(() => DeletePostPayload)
  async deletePost (@Arg('data') { id }: DeletePostInput) {
    try {
      return Object.assign(new DeletePostSuccess(), {
        post: await deletePost({ id })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }

  @Mutation(() => PublishPostPayload)
  async publishPost (@Arg('data') { id }: PublishPostInput) {
    try {
      return Object.assign(new PublishPostSuccess(), {
        post: await updatePost(id, { isPublished: true })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }

  @Mutation(() => UnpublishPostPayload)
  async unpublishPost (@Arg('data') { id }: UnpublishPostInput) {
    try {
      return Object.assign(new PublishPostSuccess(), {
        post: await updatePost(id, { isPublished: false })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }
}
