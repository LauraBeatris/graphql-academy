import { createUnionType, Field, ID, InputType, ObjectType } from 'type-graphql'
import { User } from './user'
import { UserError } from './userError'

@ObjectType({ description: 'Represents a comment from a Post created by a User' })
export class Comment {
  @Field(() => ID)
    id: string

  @Field()
    text: string

  @Field(() => User, { nullable: true })
    author?: User
}

@InputType()
export class CreateCommentInput implements Partial<Comment> {
  @Field()
    text: string

  @Field(() => ID)
    postId: string

  @Field(() => ID)
    authorId: string
}
@ObjectType()
export class CreateCommentSuccess {
  @Field(() => Comment)
    comment: Comment
}
export const CreateCommentPayload = createUnionType({
  name: 'CreateCommentPayload',
  types: () => [CreateCommentSuccess, UserError] as const
})

@InputType()
export class DeleteCommentInput implements Partial<Comment> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class DeleteCommentSuccess {
  @Field(() => Comment)
    comment: Comment
}
export const DeleteCommentPayload = createUnionType({
  name: 'DeleteCommentPayload',
  types: () => [DeleteCommentSuccess, UserError] as const
})
