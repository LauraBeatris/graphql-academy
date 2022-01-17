import { Min } from 'class-validator'
import { Args, ArgsType, Field, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql'
import { getAllComments, getCommentAuthor } from 'data/comments'
import { Comment } from 'graphql/schema/Comment.schema'
import { User } from 'graphql/schema/User.schema'

@ArgsType()
class GetCommentsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
    take?: number
}

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments (@Args() { take }: GetCommentsArgs) {
    return getAllComments({ take })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: commentId }: Comment
  ) {
    return getCommentAuthor({ commentId })
  }
}
