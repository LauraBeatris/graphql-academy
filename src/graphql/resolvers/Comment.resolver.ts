import { Query, Resolver } from 'type-graphql'
import { getAllComments } from 'data/comments'
import { Comment } from 'graphql/schema/Comment.schema'

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments () {
    return getAllComments()
  }
}
