import { Query, Resolver } from 'type-graphql'
import { Post } from 'graphql/schema/Post.schema'

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts () {
    return [{ id: '1', title: 'Mock post title', isPublished: false }]
  }
}
