import { createUnionType, Field, ID, ObjectType } from 'type-graphql'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { Post } from './post'
import { UserError } from './userError'

@ObjectType()
export class User {
  @Field(() => ID)
    id: string

  @Field()
    name: string

  @Field()
    email: string

  @Field(() => [Post], { nullable: 'itemsAndList' })
    posts?: Post[]
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
