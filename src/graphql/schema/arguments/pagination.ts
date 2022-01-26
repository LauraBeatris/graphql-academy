import { Max, Min } from 'class-validator'
import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
    take?: number
}
