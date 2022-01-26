import { BadRequestError, NotFoundError } from 'errors'
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
    throw new BadRequestError({
      message: 'Email provided is already taken.',
      metadata: {
        emailWasTaken: true
      }
    })
  }

  const existingUserByUserName = await dbClient.user.findUnique({
    where: {
      name
    }
  })
  if (existingUserByUserName) {
    throw new BadRequestError({
      message: 'Username provided is already taken.',
      metadata: {
        suggestedUsername: generateSuggestedUsername(name)
      }
    })
  }

  return dbClient.user.create({
    data: {
      name,
      email
    }
  })
}

export const deleteUser = async ({ id }: { id: string }) => {
  const user = await dbClient.user.findUnique({
    where: {
      id
    }
  })

  if (!user) {
    throw new NotFoundError({
      path: ['deleteUser'],
      message: 'User not found'
    })
  }

  return dbClient.user.delete({ where: { id } })
}
