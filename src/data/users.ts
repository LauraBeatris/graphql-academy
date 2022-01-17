import { dbClient } from './config'

export const getAllUsers = ({ take }: { take: number }) => (
  dbClient.user.findMany({ take })
)
