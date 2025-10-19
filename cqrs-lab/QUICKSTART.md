# 快速启动指南

## 5 分钟内启动 CQRS Lab

### 前置要求

- Node.js 18+ 
- Docker & Docker Compose
- (可选) jq - JSON 处理工具，用于测试脚本

### 步骤 1: 安装依赖

```bash
cd cqrs-lab
npm install
```

### 步骤 2: 创建环境变量

创建三个文件（或使用以下命令）：

```bash
# .env
echo 'PORT=3000
COMMAND_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/command_db?schema=public"
QUERY_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/query_db?schema=public"' > .env

# .env.command
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/command_db?schema=public"' > .env.command

# .env.query
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/query_db?schema=public"' > .env.query
```

### 步骤 3: 启动数据库

```bash
docker-compose up -d
```

等待 5 秒让数据库完全启动。

### 步骤 4: 生成 Prisma Client 并推送 Schema

```bash
# 生成客户端
npx prisma generate --schema=./prisma/schema-command.prisma
npx prisma generate --schema=./prisma/schema-query.prisma

# 推送 Schema
npm run prisma:push
```

### 步骤 5: 启动服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

## 验证安装

### 检查服务器

```bash
curl http://localhost:3000
```

应该看到：

```json
{
  "message": "CQRS Lab - Database-level CQRS with Prisma & PostgreSQL",
  "architecture": {
    "commandDB": "localhost:5432 (Write operations)",
    "queryDB": "localhost:5433 (Read operations)"
  },
  "endpoints": {
    "users": "/api/users",
    "posts": "/api/posts",
    "sync": "/api/sync"
  }
}
```

## 测试 API

### 1. 创建用户

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

复制返回的 `id`，在下一步使用。

### 2. 创建文章

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Hello CQRS",
    "content":"This is my first post",
    "published":true,
    "authorId":"<刚才创建的用户ID>"
  }'
```

### 3. 查询文章

```bash
# 获取所有文章
curl http://localhost:3000/api/posts

# 只获取已发布的
curl http://localhost:3000/api/posts?published=true

# 搜索
curl "http://localhost:3000/api/posts/search?q=CQRS"
```

## 查看数据库

### 使用 Prisma Studio

```bash
# 查看 Command DB（写库）
npm run prisma:studio:command

# 查看 Query DB（读库）
npm run prisma:studio:query
```

在浏览器中访问显示的 URL（通常是 http://localhost:5555）。

### 使用 Docker

```bash
# 连接到 Command DB
docker exec -it cqrs-command-db psql -U postgres -d command_db

# 连接到 Query DB
docker exec -it cqrs-query-db psql -U postgres -d query_db
```

然后可以执行 SQL 查询：

```sql
\dt                          -- 列出所有表
SELECT * FROM "User";        -- 查询用户
SELECT * FROM "Post";        -- 查询文章
```

## 使用 Makefile (推荐)

如果你的系统支持 `make`：

```bash
# 一键设置（推荐首次使用）
make setup

# 启动开发服务器
make dev

# 运行 API 测试
make test-api

# 查看帮助
make help
```

## 常见问题

### 数据库连接失败？

确保 Docker 容器正在运行：

```bash
docker ps
```

应该看到 `cqrs-command-db` 和 `cqrs-query-db`。

### Prisma Client 找不到？

重新生成：

```bash
npx prisma generate --schema=./prisma/schema-command.prisma
npx prisma generate --schema=./prisma/schema-query.prisma
```

### 数据不一致？

执行全量同步：

```bash
curl -X POST http://localhost:3000/api/sync/full
```

### 重置一切

```bash
# 停止并删除所有数据
docker-compose down -v

# 重新开始
make setup
# 或
docker-compose up -d && npm run prisma:push
```

## 下一步

- 阅读 [README.md](./README.md) 了解完整 API
- 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 理解架构设计
- 尝试修改 Schema 添加新字段
- 查看服务器日志，观察读写分离的过程

## 需要帮助？

检查以下内容：

1. Node.js 版本：`node --version`（需要 18+）
2. Docker 版本：`docker --version`
3. 容器状态：`docker ps`
4. 服务器日志：查看终端输出
5. 数据库日志：`docker-compose logs`

祝实验愉快！🚀

