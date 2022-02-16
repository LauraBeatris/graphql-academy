import { Max, Min } from 'class-validator'
import * as Relay from 'graphql-relay'

import { ArgsType, ClassType, Field, Int, ObjectType } from 'type-graphql'

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

/**
 * Field that contains metadata about the pagination itself
 */
@ObjectType()
export class PageInfo implements Relay.PageInfo {
  @Field(() => Boolean)
    hasNextPage: boolean

  @Field(() => Boolean)
    hasPreviousPage: boolean

  @Field(() => String, { nullable: true })
    endCursor: string

  @Field(() => String, { nullable: true })
    startCursor: string
}

/**
 * Generates an edge type with extra connection metadata for a particular item type
 */
export function EdgeType<NodeType> (
  nodeName: string,
  nodeType: ClassType<NodeType>
) {
  @ObjectType(`${nodeName}Edge`, { isAbstract: true })
  abstract class Edge implements Relay.Edge<NodeType> {
    @Field(() => nodeType)
      node: NodeType

    @Field(() => String, {
      description: 'Used in `before` and `after` args'
    })
      cursor: Relay.ConnectionCursor
  }

  return Edge
}

type ExtractNodeType<EdgeType> = EdgeType extends Relay.Edge<infer NodeType>
  ? NodeType
  : never;

export function ConnectionType<
  EdgeType extends Relay.Edge<ExtractNodeType<EdgeType>>,
  NodeType = ExtractNodeType<EdgeType>
> (nodeName: string, edgeClass: ClassType<EdgeType>) {
  @ObjectType(`${nodeName}Connection`, { isAbstract: true })
  abstract class Connection implements Relay.Connection<NodeType> {
    @Field(() => PageInfo)
      pageInfo: PageInfo

    @Field(() => [edgeClass])
      edges: EdgeType[]
  }

  return Connection
}
