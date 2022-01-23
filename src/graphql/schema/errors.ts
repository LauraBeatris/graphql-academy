import { Field, ObjectType, registerEnumType } from 'type-graphql'

export enum ErrorCode {
  DUPLICATE_ENTRY = 1062
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  valuesConfig: {
    DUPLICATE_ENTRY: {
      description: 'Duplicated entry on the data source.'
    }
  }
})

@ObjectType()
export class UserError {
  @Field()
    message: string

  @Field(() => ErrorCode)
    code?: ErrorCode
}
