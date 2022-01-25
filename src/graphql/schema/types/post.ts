import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './comment'
import { User } from './user'

@ObjectType({ description: 'Represents a blog post created by a User' })
export class Post {
  @Field(() => ID)
    id: string

  @Field()
    title: string

  @Field(() => User, { nullable: true })
    author?: User

  @Field({ nullable: true })
    description?: string

  @Field()
    isPublished: boolean

  @Field(() => [Comment], { nullable: 'itemsAndList' })
    comments?: Comment[]
}
