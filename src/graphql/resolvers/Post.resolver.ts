import { Query, Resolver } from 'type-graphql'
import { getAllPosts } from 'data/posts'
import { Post } from 'graphql/schema/Post.schema'

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts () {
    return getAllPosts()
  }
}
