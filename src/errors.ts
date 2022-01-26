export enum ErrorCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400
}

type CustomErrorFields = {
  path?: Array<string>;
  code?: number;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Custom error class to be instantiated with custom messages & data object
 * @see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
 */
export class CustomError extends Error {
  constructor ({ code, path, message, metadata }: CustomErrorFields) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)

    this.code = code
    this.path = path
    this.metadata = metadata ?? {}
  }

  code?: CustomErrorFields['code']
  path?: CustomErrorFields['path']
  metadata?: CustomErrorFields['metadata']
}

export class BadRequestError extends CustomError {
  constructor (args: CustomErrorFields) {
    super(args)
    Object.setPrototypeOf(this, CustomError.prototype)

    this.message = args.message ?? 'Bad request'
  }

  code = ErrorCode.BAD_REQUEST
}

export class NotFoundError extends CustomError {
  constructor (args: CustomErrorFields) {
    super(args)
    Object.setPrototypeOf(this, CustomError.prototype)

    this.message = args.message ?? 'Resource not found'
  }

  code = ErrorCode.NOT_FOUND
}

export const handleResolverError = (error: unknown, handleCustomError: () => unknown) => {
  if (error instanceof CustomError) {
    return handleCustomError()
  }

  return error
}
