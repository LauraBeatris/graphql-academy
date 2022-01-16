import { Query, Resolver } from 'type-graphql'
import { Comment } from 'graphql/schema/Comment.schema'

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments () {
    return [{ id: '1', text: 'This is a mock comment' }]
  }
}
