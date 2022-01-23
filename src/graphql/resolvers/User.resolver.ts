import { Arg, Args, createUnionType, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { createUser, getAllUsers } from 'data/users'
import { UserError } from 'graphql/schema/errors'
import { Post } from 'graphql/schema/Post.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
import { User } from 'graphql/schema/User.schema'

@ObjectType()
class CreateUserSuccess {
  @Field(() => User)
    user: User
}
@ObjectType()
class EmailTakenError {
  @Field()
    emailWasTaken: boolean
}

const mapMutationValueKeyToObjectType = {
  user: CreateUserSuccess,
  code: UserError,
  emailWasTaken: EmailTakenError
}
const CreateUserPayload = createUnionType({
  name: 'CreateUserPayload',
  types: () => [CreateUserSuccess, EmailTakenError, UserError] as const,
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
  createUser (@Arg('data', {
    description: 'Represents the input data needed to create a new user'
  }) createUserInput: CreateUserInput) {
    const { name, email } = createUserInput

    return createUser({ name, email })
  }
}
