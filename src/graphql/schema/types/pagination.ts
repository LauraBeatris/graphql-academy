import { Max, Min } from 'class-validator'
import * as Relay from 'graphql-relay'

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

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => String, {
    nullable: true,
    description: 'Paginate after cursor'
  })
    after?: Relay.ConnectionCursor

  @Field(() => String, {
    nullable: true,
    description: 'Paginate before cursor'
  })
    before?: Relay.ConnectionCursor

  @Field(() => Number, { nullable: true, description: 'Paginate first' })
    first?: number

  @Field(() => Number, { nullable: true, description: 'Paginate last' })
    last?: number
}
