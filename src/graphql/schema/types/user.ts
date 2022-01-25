import { Field, ID, ObjectType } from 'type-graphql'
import { Post } from './post'

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