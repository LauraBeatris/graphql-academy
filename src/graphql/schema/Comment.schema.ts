import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Represents a comment from a Post created by a User' })
export class Comment {
  @Field(() => ID)
    id: string

  @Field()
    text: string
}
