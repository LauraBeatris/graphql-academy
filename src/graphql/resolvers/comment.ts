import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { createComment, deleteComment, getAllComments, getCommentAuthor } from 'data/comments'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { Comment, CreateCommentInput, CreateCommentPayload, DeleteCommentInput, DeleteCommentPayload } from 'graphql/schema/types/comment'
import { User } from 'graphql/schema/types/user'

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments (@Args() { take }: PaginationArgs) {
    return getAllComments({ take })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: commentId }: Comment
  ) {
    return getCommentAuthor({ commentId })
  }

  @Mutation(() => CreateCommentPayload)
  createComment (@Arg('data') { text, postId, authorId }: CreateCommentInput) {
    return createComment({ text, postId, authorId })
  }

  @Mutation(() => DeleteCommentPayload)
  deleteComment (@Arg('data') { id }: DeleteCommentInput) {
    return deleteComment({ id })
  }
}
