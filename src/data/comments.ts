import { dbClient } from './config'

export const getAllComments = () => dbClient.comment.findMany()
