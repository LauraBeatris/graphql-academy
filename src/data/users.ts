import { dbClient } from './config'

export const getAllUsers = () => dbClient.user.findMany()
