import { EmailTakenError } from 'graphql/resolvers/User.resolver'
import { ErrorCode, UserError } from 'graphql/schema/UserError.schema'
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
    return Object.assign(new EmailTakenError(), {
      code: ErrorCode.BAD_REQUEST,
      message: "There's an existing user with the provided email.",
      emailWasTaken: true
    })
  }

  return {
    user: await dbClient.user.create({
      data: {
        name,
        email
      }
    })
  }
}

export const deleteUser = async ({ id }: { id: string }) => {
  const user = await dbClient.user.findUnique({
    where: {
      id
    }
  })

  if (!user) {
    return Object.assign(new UserError(), {
      code: ErrorCode.NOT_FOUND,
      message: 'User not found'
    })
  }

  return {
    user: await dbClient.user.delete({ where: { id } })
  }
}
