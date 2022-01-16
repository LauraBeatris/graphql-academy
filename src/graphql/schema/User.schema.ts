import { ID, Field, ObjectType } from 'type-graphql'

@ObjectType({ description: 'Represents a blog user'})
export class User {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
