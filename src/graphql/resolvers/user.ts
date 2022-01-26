import { handleResolverError } from 'errors'
import { Arg, Args, createUnionType, Field, FieldResolver, ID, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { createUser, deleteUser, getAllUsers } from 'data/users'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { Post } from 'graphql/schema/types/post'
import { CreateUserPayload, CreateUserSuccess, EmailTakenError, User, UserNameTakenError } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

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
  async createUser (@Arg('data', {
    description: 'Represents the input data needed to create a new user'
  }) { name, email }: CreateUserInput) {
    try {
      return Object.assign(new CreateUserSuccess(), {
        user: await createUser({ name, email })
      })
    } catch (error) {
      return handleResolverError(error, () => {
        const {
          path,
          code,
          message,
          metadata: { suggestedUsername, emailWasTaken }
        } = error

        if (suggestedUsername) {
          return Object.assign(new UserNameTakenError(), {
            code,
            message,
            suggestedUsername
          })
        }

        if (emailWasTaken) {
          return Object.assign(new EmailTakenError(), {
            code,
            message,
            emailWasTaken
          })
        }

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }

  @Mutation(() => DeleteUserPayload)
  async deleteUser (@Arg('data') { id }: DeleteUserInput) {
    try {
      return {
        user: await deleteUser({ id })
      }
    } catch (error) {
      return handleResolverError(error, () => {
        const { code, path, message } = error

        return Object.assign(new UserError(), { code, path, message })
      })
    }
  }
}
