import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { getAllComments, getCommentAuthor } from 'data/comments'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { Comment } from 'graphql/schema/types/comment'
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
}
