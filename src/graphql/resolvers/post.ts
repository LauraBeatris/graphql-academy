import { handleResolverError } from 'errors'
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { createPost, deletePost, getAllPosts, getPostAuthor, getPostBrand, updatePost } from 'data/posts'
import { Brand } from 'graphql/schema/types/brand'
import { Comment } from 'graphql/schema/types/comment'
import { ConnectionArgs, OffsetPaginationArgs, transformDataToConnection } from 'graphql/schema/types/pagination'
import { CreatePostInput, CreatePostPayload, CreatePostSuccess, DeletePostInput, DeletePostPayload, DeletePostSuccess, IPost, MarketingPost, PostConnection, PostTitleTakenError, PublishPostInput, PublishPostPayload, PublishPostSuccess, UnpublishPostInput, UnpublishPostPayload, UnpublishPostSuccess } from 'graphql/schema/types/post'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@Resolver(() => IPost)
export class PostResolver {
  @Query(() => PostConnection)
  async posts (@Args() { after, first }: ConnectionArgs) {
    return transformDataToConnection({
      data: await getAllPosts({ after, first }),
      first,
      nodeName: 'post'
    })
  }

  @FieldResolver(() => [Comment], { nullable: 'itemsAndList' })
  comments (
    @Root() { id: postId }: IPost,
    @Args() { take, skip }: OffsetPaginationArgs
  ) {
    return getPostComments({ postId, take, skip })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: postId }: IPost
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

@Resolver(() => MarketingPost)
export class MarketingPostResolver {
  @FieldResolver(() => Brand, { nullable: true })
  brand (@Root() { id: brandId }: Brand) {
    return getPostBrand({ brandId })
  }
}
