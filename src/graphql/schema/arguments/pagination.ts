import { Max, Min } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export class OffsetPaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
    take?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
    skip?: number
}
