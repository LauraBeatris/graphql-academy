import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { getAllPosts, getPostAuthor } from 'data/posts'
import { Comment } from 'graphql/schema/Comment.schema'
import { Post } from 'graphql/schema/Post.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
import { User } from 'graphql/schema/User.schema'

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
}
