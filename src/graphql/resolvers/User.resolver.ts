import { Query, Resolver } from 'type-graphql'

import { User } from '../schema/User.schema'

@Resolver(User)
export class UserResolver {
  @Query(() => [User], { nullable: 'itemsAndList' })
  users () {
    return [{ id: '1', name: 'Laura', email: 'laura@gmail.com' }]
  }
}
