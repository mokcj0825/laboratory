/**
 * 数据库客户端配置
 * 分别连接到 Command DB (写库) 和 Query DB (读库)
 */
import { PrismaClient as CommandPrismaClient } from '../../node_modules/.prisma/client-command';
import { PrismaClient as QueryPrismaClient } from '../../node_modules/.prisma/client-query';

// Command Database - 处理所有写操作
export const commandDB = new CommandPrismaClient({
  datasources: {
    db: {
      url: process.env.COMMAND_DATABASE_URL,
    },
  },
});

// Query Database - 处理所有读操作
export const queryDB = new QueryPrismaClient({
  datasources: {
    db: {
      url: process.env.QUERY_DATABASE_URL,
    },
  },
});

// 优雅关闭
export async function disconnectDatabases() {
  await commandDB.$disconnect();
  await queryDB.$disconnect();
}

