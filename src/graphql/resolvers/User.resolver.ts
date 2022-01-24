import { Arg, Args, createUnionType, Field, FieldResolver, ID, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { createUser, deleteUser, getAllUsers } from 'data/users'
import { Post } from 'graphql/schema/Post.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
import { User } from 'graphql/schema/User.schema'
import { ErrorCode, UserError } from 'graphql/schema/UserError.schema'

@ObjectType()
class CreateUserSuccess {
  @Field(() => User)
    user: User
}
@ObjectType()
export class EmailTakenError implements Partial<UserError> {
  @Field(() => ErrorCode)
    code: ErrorCode

  @Field()
    message: string

  @Field()
    emailWasTaken: boolean
}
const CreateUserPayload = createUnionType({
  name: 'CreateUserPayload',
  types: () => [CreateUserSuccess, EmailTakenError] as const
})

@InputType()
class CreateUserInput implements Partial<User> {
  @Field()
    name: string

  @Field()
    email: string
}
@InputType()
class DeleteUserInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
class DeleteUserSuccess {
  @Field(() => User)
    user: User
}
const DeleteUserPayload = createUnionType({
  name: 'DeleteUserPayload',
  types: () => [DeleteUserSuccess, UserError] as const
})

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
  }) { name, email }: CreateUserInput) {
    return createUser({ name, email })
  }

  @Mutation(() => DeleteUserPayload)
  async deleteUser (@Arg('data') { id }: DeleteUserInput) {
    return deleteUser({ id })
  }
}
