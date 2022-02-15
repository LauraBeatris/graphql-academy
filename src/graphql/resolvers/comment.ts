import { handleResolverError } from 'errors'
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { createComment, deleteComment, getAllComments, getCommentAuthor } from 'data/comments'
import { OffsetPaginationArgs } from 'graphql/schema/arguments/pagination'
import { Comment, CreateCommentInput, CreateCommentPayload, CreateCommentSuccess, DeleteCommentInput, DeleteCommentPayload, DeleteCommentSuccess } from 'graphql/schema/types/comment'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments (@Args() { take, skip }: OffsetPaginationArgs) {
    return getAllComments({ take, skip })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: commentId }: Comment
  ) {
    return getCommentAuthor({ commentId })
  }

  @Mutation(() => CreateCommentPayload)
  async createComment (@Arg('data') { text, postId, authorId }: CreateCommentInput) {
    try {
      return Object.assign(new CreateCommentSuccess(), {
        comment: await createComment({ text, postId, authorId })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }

  @Mutation(() => DeleteCommentPayload)
  async deleteComment (@Arg('data') { id }: DeleteCommentInput) {
    try {
      return Object.assign(new DeleteCommentSuccess(), {
        comment: await deleteComment({ id })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }
}
