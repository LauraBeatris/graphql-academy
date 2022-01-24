import { Arg, Args, createUnionType, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql'
import { getPostComments } from 'data/comments'
import { createPost, getAllPosts, getPostAuthor } from 'data/posts'
import { Comment } from 'graphql/schema/Comment.schema'
import { Post } from 'graphql/schema/Post.schema'
import { PaginationArgs } from 'graphql/schema/sharedArguments'
import { User } from 'graphql/schema/User.schema'
import { ErrorCode, UserError } from 'graphql/schema/UserError.schema'

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
class CreatePostSuccess {
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
    titleWasTaken: boolean
}
const CreatePostPayload = createUnionType({
  name: 'CreatePostPayload',
  types: () => [CreatePostSuccess, PostTitleTakenError] as const
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
}
