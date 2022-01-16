import { dbClient } from './config'

export const getAllPosts = () => dbClient.post.findMany()
