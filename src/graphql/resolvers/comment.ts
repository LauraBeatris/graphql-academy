import { Arg, Args, createUnionType, Field, FieldResolver, ID, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { createComment, deleteComment, getAllComments, getCommentAuthor } from 'data/comments'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { Comment } from 'graphql/schema/types/comment'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@InputType()
class CreateCommentInput implements Partial<Comment> {
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
const CreateCommentPayload = createUnionType({
  name: 'CreateCommentPayload',
  types: () => [CreateCommentSuccess, UserError] as const
})

@InputType()
class DeleteCommentInput implements Partial<Comment> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class DeleteCommentSuccess {
  @Field(() => Comment)
    comment: Comment
}
const DeleteCommentPayload = createUnionType({
  name: 'DeleteCommentPayload',
  types: () => [DeleteCommentSuccess, UserError] as const
})

@Resolver(Comment)
export class CommentResolver {
  @Query(() => [Comment], { nullable: 'itemsAndList' })
  comments (@Args() { take }: PaginationArgs) {
    return getAllComments({ take })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: commentId }: Comment
  ) {
    return getCommentAuthor({ commentId })
  }

  @Mutation(() => CreateCommentPayload)
  createComment (@Arg('data') { text, postId, authorId }: CreateCommentInput) {
    return createComment({ text, postId, authorId })
  }

  @Mutation(() => DeleteCommentPayload)
  deleteComment (@Arg('data') { id }: DeleteCommentInput) {
    return deleteComment({ id })
  }
}
