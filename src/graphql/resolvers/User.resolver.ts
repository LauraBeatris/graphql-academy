import { Min } from 'class-validator'
import { Arg, Args, ArgsType, createUnionType, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { dbClient } from 'data/config'
import { getUserPosts } from 'data/posts'
import { getAllUsers } from 'data/users'
import { Post } from 'graphql/schema/Post.schema'
import { User } from 'graphql/schema/User.schema'

@ObjectType()
class CreateUserSuccess {
  @Field(() => User)
    user: User
}

const mapMutationValueKeyToObjectType = {
  user: CreateUserSuccess
}
const CreateUserPayload = createUnionType({
  name: 'CreateUserPayload',
  types: () => [CreateUserSuccess] as const,
  resolveType: mutationValue => {
    const mapperKeys = Object.keys(mapMutationValueKeyToObjectType)
    const mutationValueKey = mapperKeys.find((key) => key in mutationValue)

    return mapMutationValueKeyToObjectType[mutationValueKey]
  }
})

@InputType({ description: 'Represents the input data needed to create a user' })
class CreateUserInput implements Partial<User> {
  @Field()
    name: string

  @Field()
    email: string
}

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

  @Mutation(() => CreateUserPayload)
  async createUser (@Arg('data') createUserInput: CreateUserInput) {
    const { name, email } = createUserInput

    const user = dbClient.user.create({
      data: {
        name,
        email
      }
    })

    return {
      user
    }
  }

  @FieldResolver(() => [Post], { nullable: 'itemsAndList' })
  posts (
    @Root() { id: userId }: User,
    @Args(() => GetUserPostsArgs) { take }: GetUserPostsArgs
  ) {
    return getUserPosts({ userId, take })
  }
}
