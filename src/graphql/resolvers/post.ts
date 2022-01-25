import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { createPost, deletePost, getAllPosts, getPostAuthor, updatePost } from 'data/posts'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { Comment } from 'graphql/schema/types/comment'
import { CreatePostInput, CreatePostPayload, DeletePostInput, DeletePostPayload, Post, PublishPostInput, PublishPostPayload, PublishPostSuccess, UnpublishPostInput, UnpublishPostPayload, UnpublishPostSuccess } from 'graphql/schema/types/post'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts (@Args() { take }: PaginationArgs) {
    return getAllPosts({ take })
  }

  @FieldResolver(() => [Comment], { nullable: 'itemsAndList' })
  comments (
    @Root() { id: postId }: Post,
    @Args() { take }: PaginationArgs
  ) {
    return getPostComments({ postId, take })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: postId }: Post
  ) {
    return getPostAuthor({ postId })
  }

  @Mutation(() => CreatePostPayload)
  createPost (@Arg('data') { title, authorId, description }: CreatePostInput) {
    return createPost({ title, authorId, description })
  }

  @Mutation(() => DeletePostPayload)
  deletePost (@Arg('data') { id }: DeletePostInput) {
    return deletePost({ id })
  }

  @Mutation(() => PublishPostPayload)
  async publishPost (@Arg('data') { id }: PublishPostInput) {
    const updateResult = await updatePost(id, { isPublished: true })

    if (updateResult instanceof UserError) return updateResult

    return Object.assign(new PublishPostSuccess(), { post: updateResult })
  }

  @Mutation(() => UnpublishPostPayload)
  async unpublishPost (@Arg('data') { id }: UnpublishPostInput) {
    const updateResult = await updatePost(id, { isPublished: false })

    if (updateResult instanceof UserError) return updateResult

    return Object.assign(new UnpublishPostSuccess(), { post: updateResult })
  }
}
