import { registerEnumType } from 'type-graphql'

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
