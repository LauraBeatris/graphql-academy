import { Min } from 'class-validator'
import { Args, ArgsType, Field, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { getAllPosts, getPostAuthor } from 'data/posts'
import { Comment } from 'graphql/schema/Comment.schema'
import { Post } from 'graphql/schema/Post.schema'
import { User } from 'graphql/schema/User.schema'

@ArgsType()
class GetPostsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
    take?: number
}

@ArgsType()
class GetPostCommentsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
    take?: number
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts (@Args() { take }: GetPostsArgs) {
    return getAllPosts({ take })
  }

  @FieldResolver(() => [Comment], { nullable: 'itemsAndList' })
  comments (
    @Root() { id: postId }: Post,
    @Args(() => GetPostCommentsArgs) { take }: GetPostCommentsArgs
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
