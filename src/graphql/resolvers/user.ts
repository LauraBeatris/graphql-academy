import { handleResolverError } from 'errors'
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { getUserPosts } from 'data/posts'
import { createUser, deleteUser, getAllUsers } from 'data/users'
import { OffsetPaginationArgs } from 'graphql/schema/arguments/pagination'
import { Post } from 'graphql/schema/types/post'
import { CreateUserInput, CreateUserPayload, CreateUserSuccess, DeleteUserInput, DeleteUserPayload, EmailTakenError, User, UserNameTakenError } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@Resolver(User)
export class UserResolver {
  @Query(() => [User], { nullable: 'itemsAndList' })
  users (@Args() { take, skip }: OffsetPaginationArgs) {
    return getAllUsers({ take, skip })
  }

  @FieldResolver(() => [Post], { nullable: 'itemsAndList' })
  posts (
    @Root() { id: userId }: User,
    @Args() { take, skip }: OffsetPaginationArgs
  ) {
    return getUserPosts({ userId, take, skip })
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
