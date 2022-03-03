import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class Brand {
  @Field(() => ID)
    id: string

  @Field()
    name: string
}
