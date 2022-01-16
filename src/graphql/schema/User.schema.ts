import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Represents a blog user' })
export class User {
  @Field(() => ID)
    id: string

  @Field()
    name: string

  @Field()
    email: string
}
