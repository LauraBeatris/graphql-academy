import { Arg, Args, createUnionType, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { dbClient } from 'data/config'
import { getUserPosts } from 'data/posts'
import { getAllUsers } from 'data/users'
import { Post } from 'graphql/schema/Post.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
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

@InputType()
class CreateUserInput implements Partial<User> {
  @Field()
    name: string

  @Field()
    email: string
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User], { nullable: 'itemsAndList' })
  users (@Args() { take }: PaginationArgs) {
    return getAllUsers({ take })
  }

  @FieldResolver(() => [Post], { nullable: 'itemsAndList' })
  posts (
    @Root() { id: userId }: User,
    @Args() { take }: PaginationArgs
  ) {
    return getUserPosts({ userId, take })
  }

  @Mutation(() => CreateUserPayload)
  async createUser (@Arg('data', {
    description: 'Represents the input data needed to create a new user'
  }) createUserInput: CreateUserInput) {
    const { name, email } = createUserInput

    const user = await dbClient.user.create({
      data: {
        name,
        email
      }
    })

    return {
      user
    }
  }
}
