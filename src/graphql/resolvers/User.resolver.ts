import { Int,  Args, Field, Query, ArgsType, Resolver } from 'type-graphql'
import { Max, Min } from 'class-validator';

import { User } from '../schema/User.schema';

@ArgsType()
class UsersArgs {
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take: number = 10
}

@Resolver(User)
export class UserResolver {
  @Query(returns => [User], { nullable: "itemsAndList" })
  users(@Args() { skip, take }: UsersArgs){
    return [{ id: '1', name: 'Laura', email: 'laura@gmail.com' }]
  }
}
