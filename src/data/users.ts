import { CreateUserSuccess, DeleteUserSuccess, EmailTakenError, UserNameTakenError } from 'graphql/resolvers/user'
import { ErrorCode } from 'graphql/schema/enums/errorCode'
import { UserError } from 'graphql/schema/types/userError'
import { dbClient } from './config'

export const getAllUsers = ({ take }: { take: number }) => (
  dbClient.user.findMany({ take })
)

const usernameRandomSuggestions = ['aachen', 'aalbord', 'aaelsund', '3d', '2d', 'aaren', 'aargau', 'aarhus', 'aarika']
const generateSuggestedUsername = (name: string) => {
  const suggestionToPrepend = usernameRandomSuggestions[Math.floor(Math.random() * usernameRandomSuggestions.length)]
  const randomNumberToPrepend = Math.floor((Math.random() * 1000) + 1)

  return `${name}-${suggestionToPrepend}${randomNumberToPrepend}`.trim().toLocaleLowerCase()
}

export const createUser = async ({
  name, email
}: { name: string; email: string; }) => {
  const existingUserByEmail = await dbClient.user.findUnique({
    where: {
      email
    }
  })
  if (existingUserByEmail) {
    return Object.assign(new EmailTakenError(), {
      code: ErrorCode.BAD_REQUEST,
      message: "There's an existing user with the provided email.",
      emailWasTaken: true
    })
  }

  const existingUserByUserName = await dbClient.user.findUnique({
    where: {
      name
    }
  })
  if (existingUserByUserName) {
    return Object.assign(new UserNameTakenError(), {
      code: ErrorCode.BAD_REQUEST,
      message: "There's an existing user with the provided username.",
      suggestedUsername: generateSuggestedUsername(name)
    })
  }

  return Object.assign(new CreateUserSuccess(), {
    user: await dbClient.user.create({
      data: {
        name,
        email
      }
    })
  })
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
      path: ['user', 'id'],
      message: 'User not found'
    })
  }

  return Object.assign(new DeleteUserSuccess(), {
    user: await dbClient.user.delete({ where: { id } })
  })
}
