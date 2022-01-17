import { Min } from 'class-validator'
import { Args, ArgsType, Field, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { getAllUsers } from 'data/users'
import { Post } from 'graphql/schema/Post.schema'
import { User } from 'graphql/schema/User.schema'

@ArgsType()
class GetUsersArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
    take?: number
}

@ArgsType()
class GetUserPostsArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
    take?: number
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User], { nullable: 'itemsAndList' })
  users (@Args() { take }: GetUsersArgs) {
    return getAllUsers({ take })
  }

  @FieldResolver(() => [Post], { nullable: 'itemsAndList' })
  posts (
    @Root() { id: userId }: User,
    @Args(() => GetUserPostsArgs) { take }: GetUserPostsArgs
  ) {
    return getUserPosts({ userId, take })
  }
}
