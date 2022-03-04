import { createUnionType, Field, ID, InputType, ObjectType } from 'type-graphql'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { IPost } from './post'
import { UserError } from './userError'

@ObjectType()
export class User {
  @Field(() => ID)
    id: string

  @Field()
    name: string

  @Field()
    email: string

  @Field(() => [IPost], { nullable: 'itemsAndList' })
    posts?: IPost[]
}

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
export const CreateUserPayload = createUnionType({
  name: 'CreateUserPayload',
  types: () => [CreateUserSuccess, EmailTakenError, UserNameTakenError] as const
})

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
    name: string

  @Field()
    email: string
}
@InputType()
export class DeleteUserInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class DeleteUserSuccess {
  @Field(() => User)
    user: User
}
export const DeleteUserPayload = createUnionType({
  name: 'DeleteUserPayload',
  types: () => [DeleteUserSuccess, UserError] as const
})
