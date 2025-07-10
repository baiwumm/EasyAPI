import { PrismaClient } from '@prisma/client'

// 防止开发环境下重复实例化 Prisma Client
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma