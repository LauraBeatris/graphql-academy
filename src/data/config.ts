import { PrismaClient } from '@prisma/client'

export const dbClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

/**
 * Logs the time taken for a Prisma Query to run
 */
dbClient.$use(async (params, next) => {
  const before = Date.now()

  const result = await next(params)

  const after = Date.now()

  console.log(`⏰ Query ${params.model}.${params.action} took ${after - before}ms`)

  return result
})
