import { Field, ObjectType, registerEnumType } from 'type-graphql'

export enum ErrorCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  valuesConfig: {
    BAD_REQUEST: {
      description: 'Duplicated entry on the data source.'
    },
    NOT_FOUND: {
      description: 'Requested data not found on the data source.'
    }
  }
})

@ObjectType()
export class UserError {
  @Field({ description: 'An optional error code for clients to match on' })
  @Field(() => ErrorCode)
    code: ErrorCode

  @Field({ description: 'The error message' })
    message: string

  @Field(() => [String], {
    nullable: true,
    description: 'Indicates which field cause the error, if any - Field is an array that acts as a path to the error'
  })
    path?: [string]
}
