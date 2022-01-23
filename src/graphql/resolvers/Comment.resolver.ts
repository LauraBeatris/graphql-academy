import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { getAllComments, getCommentAuthor } from 'data/comments'
import { Comment } from 'graphql/schema/Comment.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
import { User } from 'graphql/schema/User.schema'

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
}
