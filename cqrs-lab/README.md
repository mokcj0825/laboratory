# CQRS Lab - 数据库层面的 CQRS 实验

这是一个使用 Prisma 和 PostgreSQL 实现**数据库层面 CQRS** 的实验项目。

## 🎯 核心概念

### 什么是数据库层面的 CQRS？

传统的 CQRS 会在代码层面分离读写模型，但这个实验项目采用不同的方式：

- ✅ **数据库层面分离**：两个独立的 PostgreSQL 数据库
  - `command_db` (写库): 接收所有的增删改操作
  - `query_db` (读库): 专门用于查询操作，数据从写库同步而来
  
- ✅ **代码层面统一**：提供统一的 CRUD API 接口
  - 开发者使用普通的 REST API，不需要区分读写
  - 内部自动将写操作路由到写库，读操作路由到读库
  
- ✅ **自动同步机制**：写操作后立即同步到读库

### 为什么这样做？

1. **读写分离的性能优势**：读库可以针对查询优化（索引、缓存等）
2. **简化应用代码**：不需要在业务逻辑中处理复杂的 CQRS 模式
3. **数据库独立扩展**：可以独立地优化和扩展读库或写库
4. **实验性质**：探索不同的架构可能性

## 📁 项目结构

```
cqrs-lab/
├── src/
│   ├── db/              # 数据库客户端配置
│   ├── sync/            # 数据同步服务
│   ├── services/        # 业务服务层
│   ├── routes/          # API 路由
│   └── index.ts         # 应用入口
├── prisma/
│   ├── schema-command.prisma  # 写库 Schema
│   └── schema-query.prisma    # 读库 Schema
├── docker-compose.yml   # Docker 配置
└── package.json
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd cqrs-lab
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env
cp .env.example .env.command
cp .env.example .env.query

# 编辑 .env.command
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/command_db?schema=public"

# 编辑 .env.query
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/query_db?schema=public"
```

### 3. 启动数据库

```bash
docker-compose up -d
```

这会启动两个 PostgreSQL 容器：
- `cqrs-command-db`: 写库，端口 5432
- `cqrs-query-db`: 读库，端口 5433

### 4. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 5. 推送数据库 Schema

```bash
npm run prisma:push
```

### 6. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

应用将在 http://localhost:3000 启动。

## 📡 API 接口

### 用户相关

| 方法 | 路径 | 说明 | 数据库 |
|------|------|------|--------|
| POST | `/api/users` | 创建用户 | Command → Query |
| GET | `/api/users` | 获取所有用户 | Query |
| GET | `/api/users/:id` | 获取单个用户 | Query |
| PUT | `/api/users/:id` | 更新用户 | Command → Query |
| DELETE | `/api/users/:id` | 删除用户 | Command → Query |

### 文章相关

| 方法 | 路径 | 说明 | 数据库 |
|------|------|------|--------|
| POST | `/api/posts` | 创建文章 | Command → Query |
| GET | `/api/posts` | 获取所有文章 | Query |
| GET | `/api/posts/:id` | 获取单个文章 | Query |
| GET | `/api/posts/search?q=keyword` | 搜索文章 | Query |
| GET | `/api/posts/author/:authorId` | 按作者获取文章 | Query |
| PUT | `/api/posts/:id` | 更新文章 | Command → Query |
| DELETE | `/api/posts/:id` | 删除文章 | Command → Query |

### 同步相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/sync/full` | 全量同步所有数据 |
| POST | `/api/sync/user/:id` | 同步单个用户 |
| POST | `/api/sync/post/:id` | 同步单个文章 |

## 🧪 测试示例

### 创建用户

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### 创建文章

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My First Post",
    "content":"This is a test post",
    "published":true,
    "authorId":"<user_id>"
  }'
```

### 查询文章

```bash
# 获取所有文章
curl http://localhost:3000/api/posts

# 只获取已发布的文章
curl http://localhost:3000/api/posts?published=true

# 搜索文章
curl http://localhost:3000/api/posts/search?q=test
```

## 🔍 验证 CQRS

### 查看数据库内容

```bash
# 查看写库
npm run prisma:studio:command

# 查看读库
npm run prisma:studio:query
```

### 验证数据流

1. **创建数据**：调用 POST API，数据先写入 Command DB
2. **自动同步**：系统自动将数据同步到 Query DB
3. **查询数据**：调用 GET API，从 Query DB 读取

### 验证读写分离

可以通过日志观察：
- 写操作（POST/PUT/DELETE）会显示 "✓ User synced" 或 "✓ Post synced"
- 读操作（GET）直接从 Query DB 查询

## 🛠️ 数据库管理

### 重置数据库

```bash
# 停止并删除容器
docker-compose down -v

# 重新启动
docker-compose up -d

# 重新推送 Schema
npm run prisma:push
```

### 全量同步

如果数据不一致，可以执行全量同步：

```bash
curl -X POST http://localhost:3000/api/sync/full
```

## 📊 架构优势

1. **性能优化**
   - Query DB 可以添加更多索引优化查询
   - 读写数据库可以独立配置和调优

2. **扩展性**
   - 可以为 Query DB 配置副本集
   - 可以针对不同的查询场景创建多个读库

3. **代码简洁**
   - 应用层不需要复杂的 CQRS 框架
   - 统一的 API 接口，易于理解和维护

4. **数据一致性**
   - 同步机制简单明了
   - 出现问题时易于调试和修复

## ⚠️ 注意事项

1. **这是实验项目**：不建议直接用于生产环境
2. **同步是同步的**：当前实现是即时同步，没有使用事件队列
3. **没有复杂的 DDD**：刻意保持简单，不引入过度设计
4. **数据一致性**：短时间内可能存在不一致（虽然我们是同步的）

## 🎓 学习要点

1. 理解读写分离的价值
2. 体验数据库层面的 CQRS
3. 观察代码层面的简洁性
4. 思考这种模式的适用场景

## 📝 TODO

- [ ] 添加异步同步机制（消息队列）
- [ ] 实现更复杂的查询模型
- [ ] 添加监控和日志
- [ ] 性能测试和对比

## 📄 License

MIT

