import { ErrorCode } from 'graphql/schema/errors'
import { dbClient } from './config'

export const getAllUsers = ({ take }: { take: number }) => (
  dbClient.user.findMany({ take })
)

export const createUser = async ({
  name, email
}: { name: string; email: string; }) => {
  const existingUser = await dbClient.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return {
      code: ErrorCode.DUPLICATE_ENTRY,
      message: "There's an existing user with the provided email.",
      emailWasTaken: true
    }
  }

  return dbClient.user.create({
    data: {
      name,
      email
    }
  })
}
