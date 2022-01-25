import { Arg, Args, createUnionType, Field, FieldResolver, ID, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { createPost, deletePost, getAllPosts, getPostAuthor } from 'data/posts'
import { PaginationArgs } from 'graphql/schema/arguments/pagination'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { Comment } from 'graphql/schema/types/comment'
import { Post } from 'graphql/schema/types/post'
import { User } from 'graphql/schema/types/user'
import { UserError } from 'graphql/schema/types/userError'

@InputType()
class CreatePostInput implements Partial<Post> {
  @Field()
    title: string

  @Field()
    authorId: string

  @Field({ nullable: true })
    description?: string
}
@ObjectType()
export class CreatePostSuccess {
  @Field(() => Post)
    post: Post
}
@ObjectType()
export class PostTitleTakenError implements Partial<UserError> {
  @Field(() => ErrorCode)
    code: ErrorCode

  @Field()
    message: string

  @Field()
    postTitleWasTaken: boolean
}
const CreatePostPayload = createUnionType({
  name: 'CreatePostPayload',
  types: () => [CreatePostSuccess, PostTitleTakenError] as const
})

@InputType()
class DeletePostInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class DeletePostSuccess {
  @Field(() => Post)
    post: Post
}
const DeletePostPayload = createUnionType({
  name: 'DeletePostPayload',
  types: () => [DeletePostSuccess, UserError] as const
})

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post], { nullable: 'itemsAndList' })
  posts (@Args() { take }: PaginationArgs) {
    return getAllPosts({ take })
  }

  @FieldResolver(() => [Comment], { nullable: 'itemsAndList' })
  comments (
    @Root() { id: postId }: Post,
    @Args() { take }: PaginationArgs
  ) {
    return getPostComments({ postId, take })
  }

  @FieldResolver(() => User, { nullable: true })
  author (
    @Root() { id: postId }: Post
  ) {
    return getPostAuthor({ postId })
  }

  @Mutation(() => CreatePostPayload)
  createPost (@Arg('data') { title, authorId, description }: CreatePostInput) {
    return createPost({ title, authorId, description })
  }

  @Mutation(() => DeletePostPayload)
  deletePost (@Arg('data') { id }: DeletePostInput) {
    return deletePost({ id })
  }
}
