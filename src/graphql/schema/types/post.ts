import { createUnionType, Field, ID, InputType, InterfaceType, ObjectType } from 'type-graphql'
import { Brand } from './brand'
import { Comment } from './comment'
import { ConnectionType, EdgeType } from './pagination'
import { User } from './user'
import { UserError } from './userError'
import { ErrorCode } from '../enums/errorCode'

@InterfaceType({
  description: 'Represents a blog post created by a User',
  resolveType: value => {
    if ('brandId' in value) {
      return 'MarketingPost'
    }

    return 'RegularPost'
  }
})
export abstract class IPost {
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
@ObjectType({ implements: IPost })
export class RegularPost extends IPost {}
@ObjectType({
  implements: IPost,
  description: 'Represents a marketing blog post attached to a Brand'
})
export class MarketingPost extends IPost {
  @Field(() => Brand, { nullable: true })
    brand: Brand
}
@ObjectType()
export class PostEdge extends EdgeType('post', IPost) {}
@ObjectType()
export class PostConnection extends ConnectionType('post', PostEdge) {}

@InputType()
export class CreatePostInput implements Partial<IPost> {
  @Field()
    title: string

  @Field()
    authorId: string

  @Field({ nullable: true })
    description?: string
}
@ObjectType()
export class CreatePostSuccess {
  @Field(() => IPost)
    post: IPost
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
export const CreatePostPayload = createUnionType({
  name: 'CreatePostPayload',
  types: () => [CreatePostSuccess, PostTitleTakenError, UserError] as const
})

@InputType()
export class DeletePostInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class DeletePostSuccess {
  @Field(() => IPost)
    post: IPost
}
export const DeletePostPayload = createUnionType({
  name: 'DeletePostPayload',
  types: () => [DeletePostSuccess, UserError] as const
})

@InputType()
export class PublishPostInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class PublishPostSuccess {
  @Field(() => IPost)
    post: IPost
}
export const PublishPostPayload = createUnionType({
  name: 'PublishPostPayload',
  types: () => [PublishPostSuccess, UserError] as const
})
@InputType()
export class UnpublishPostInput implements Partial<User> {
  @Field(() => ID)
    id: string
}
@ObjectType()
export class UnpublishPostSuccess {
  @Field(() => IPost)
    post: IPost
}
export const UnpublishPostPayload = createUnionType({
  name: 'UnpublishPostPayload',
  types: () => [UnpublishPostSuccess, UserError] as const
})
