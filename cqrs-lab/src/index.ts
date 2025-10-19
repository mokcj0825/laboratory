/**
 * CQRS Lab - 数据库层面的 CQRS 实验
 * 
 * 架构说明：
 * - Command DB (写库): 处理所有的 CUD 操作
 * - Query DB (读库): 处理所有的 R 操作
 * - 同步机制: 写操作后立即同步到读库
 */
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user-routes';
import postRoutes from './routes/post-routes';
import syncRoutes from './routes/sync-routes';
import { disconnectDatabases } from './db';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 路由
app.get('/', (req, res) => {
  res.json({
    message: 'CQRS Lab - Database-level CQRS with Prisma & PostgreSQL',
    architecture: {
      commandDB: 'localhost:5432 (Write operations)',
      queryDB: 'localhost:5433 (Read operations)',
    },
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      sync: '/api/sync',
    },
  });
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sync', syncRoutes);

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await disconnectDatabases();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await disconnectDatabases();
  process.exit(0);
});

// 启动服务器
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 CQRS Lab Server Started');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📝 Command DB (Write): localhost:5432`);
  console.log(`📖 Query DB (Read):    localhost:5433`);
  console.log('═══════════════════════════════════════════════════════');
});

