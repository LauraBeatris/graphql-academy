import { Query, Resolver } from 'type-graphql'
import { getAllUsers } from 'data/users'
import { User } from 'graphql/schema/User.schema'

@Resolver(User)
export class UserResolver {
  @Query(() => [User], { nullable: 'itemsAndList' })
  users () {
    return getAllUsers()
  }
}
