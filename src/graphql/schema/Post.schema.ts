import { Field, ID, ObjectType } from 'type-graphql'
import { Comment } from './Comment.schema'

@ObjectType({ description: 'Represents a blog post created by a User' })
export class Post {
  @Field(() => ID)
    id: string

  @Field()
    title: string

  @Field({ nullable: true })
    description: string

  @Field()
    isPublished: boolean

  @Field(() => [Comment], { nullable: 'itemsAndList' })
    comments: Comment[]
}
