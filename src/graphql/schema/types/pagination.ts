/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Max, Min } from 'class-validator'
import * as Relay from 'graphql-relay'

import { ArgsType, ClassType, Field, Int, ObjectType } from 'type-graphql'
import { dbClient } from 'data/config'

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

  @Field(() => Number, { nullable: true, description: 'Paginate first' })
    first?: number
}

/**
 * Field that contains metadata about the pagination itself
 */
@ObjectType()
export class PageInfo implements Partial<Relay.PageInfo> {
  @Field(() => Boolean)
    hasNextPage: boolean

  @Field(() => String, { nullable: true })
    endCursor: string
}

export type AbstractConstructor<T, TArgs extends any[] = any> = Function & {
  prototype: T,
  apply: (this: unknown, args: TArgs) => void
};

/**
 * Generates an edge type with extra connection metadata for a particular item type
 */
export function EdgeType<NodeType> (
  nodeName: string,
  nodeType: ClassType<NodeType> | AbstractConstructor<NodeType>
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
  abstract class Connection implements Omit<Relay.Connection<NodeType>, 'pageInfo'> {
    @Field(() => PageInfo)
      pageInfo: PageInfo

    @Field(() => [edgeClass])
      edges: any[]
  }

  return Connection
}

export const transformDataToConnection = async <T extends { id: string }>({
  data, first, nodeName
}: { data: T[], first: ConnectionArgs['first'], nodeName: string }) => {
  if (!data.length) {
    return {
      pageInfo: {
        endCursor: null,
        hasNextPage: false
      },
      edges: []
    }
  }

  const lastLinkInResults = data[data.length - 1]
  const myCursor = lastLinkInResults.id
  const secondQueryResults = await dbClient[nodeName].findMany({
    take: first,
    cursor: {
      id: myCursor
    }
  })

  return {
    pageInfo: {
      endCursor: myCursor,
      hasNextPage: secondQueryResults.length >= first
    },
    edges: data.map(node => ({
      cursor: node.id,
      node
    }))
  }
}
