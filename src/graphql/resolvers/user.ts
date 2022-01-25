import { Arg, Args, createUnionType, Field, FieldResolver, ID, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { createUser, deleteUser, getAllUsers } from 'data/users'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { Post } from 'graphql/schema/types/post'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@ObjectType()
export class CreateUserSuccess {
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
@ObjectType()
export class UserNameTakenError implements Partial<UserError> {
  @Field(() => ErrorCode)
    code: ErrorCode

  @Field()
    message: string

  @Field()
    suggestedUsername: string
}
const CreateUserPayload = createUnionType({
  name: 'CreateUserPayload',
  types: () => [CreateUserSuccess, EmailTakenError, UserNameTakenError] as const
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
export class DeleteUserSuccess {
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
  createUser (@Arg('data', {
    description: 'Represents the input data needed to create a new user'
  }) { name, email }: CreateUserInput) {
    return createUser({ name, email })
  }

  @Mutation(() => DeleteUserPayload)
  deleteUser (@Arg('data') { id }: DeleteUserInput) {
    return deleteUser({ id })
  }
}
