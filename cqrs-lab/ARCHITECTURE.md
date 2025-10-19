# 架构说明

## 核心理念

这个项目实现的是**数据库层面的 CQRS**，而不是代码层面的 CQRS。

## 传统 CQRS vs 数据库层面 CQRS

### 传统 CQRS（代码层面）

```
Client
  ↓
API Gateway
  ↓
├─ Command Service → Command Model → Database
└─ Query Service   → Query Model   → Database
```

特点：
- 代码层面分离读写模型
- 需要维护两套不同的业务逻辑
- 通常使用事件溯源（Event Sourcing）
- 复杂度高，适合复杂的领域模型

### 本项目：数据库层面 CQRS

```
Client
  ↓
Unified API
  ↓
Service Layer
  ↓
├─ Write Operations → Command DB ─┐
│                                  ├→ Sync
└─ Read Operations  → Query DB  ←─┘
```

特点：
- 代码层面统一的 CRUD 操作
- 数据库层面物理分离
- 简单的同步机制
- 保持代码简洁，获得读写分离的性能优势

## 数据流

### 写操作流程

```
POST /api/users
    ↓
UserService.createUser()
    ↓
1. commandDB.user.create()  // 写入 Command DB
    ↓
2. syncService.syncUser()    // 同步到 Query DB
    ↓
3. queryDB.user.upsert()     // 写入 Query DB
    ↓
Response
```

### 读操作流程

```
GET /api/users
    ↓
UserService.getAllUsers()
    ↓
queryDB.user.findMany()  // 直接从 Query DB 读取
    ↓
Response
```

## 数据库设计

### Command DB (写库)

- **主要用途**：接收所有的写操作（INSERT、UPDATE、DELETE）
- **Schema 特点**：
  - 标准的关系型设计
  - 使用自动生成的 ID
  - 有 `createdAt` 和 `updatedAt` 时间戳
  - 外键约束确保数据完整性

### Query DB (读库)

- **主要用途**：优化的查询性能
- **Schema 特点**：
  - 与 Command DB 相同的数据结构
  - 但有**更多的索引**来优化查询
  - 时间戳字段不自动更新（由同步机制控制）
  - 外键约束保证数据一致性

### 为什么使用相同的 Schema？

这是个实验项目，保持 Schema 相同有以下好处：

1. **简单**：不需要维护复杂的数据转换逻辑
2. **易于理解**：概念上容易把握
3. **灵活性**：未来可以根据需要调整 Query DB 的结构

在真实场景中，Query DB 可以有完全不同的结构，例如：
- 反范式化设计
- 添加聚合数据
- 预计算的统计信息

## 同步机制

### 当前实现：同步同步

```typescript
async createUser(data) {
  // 1. 写入 Command DB
  const user = await commandDB.user.create({ data });
  
  // 2. 立即同步到 Query DB
  await syncService.syncUser(user.id);
  
  return user;
}
```

**优点**：
- 简单直接
- 数据一致性强
- 易于调试

**缺点**：
- 写操作较慢（需要等待同步完成）
- 无法处理高并发写入

### 未来改进：异步同步

可以使用消息队列（如 Redis、RabbitMQ）：

```typescript
async createUser(data) {
  // 1. 写入 Command DB
  const user = await commandDB.user.create({ data });
  
  // 2. 发送同步事件到队列
  await messageQueue.publish('user.created', { userId: user.id });
  
  return user;
}
```

## 性能考虑

### 读性能优化

Query DB 可以有针对性的优化：

1. **索引策略**
   ```prisma
   model Post {
     // ...
     @@index([published])   // 按发布状态查询
     @@index([createdAt])   // 按时间排序
     @@index([title])       // 标题搜索
   }
   ```

2. **查询缓存**
   - 可以在 Query DB 前面加 Redis 缓存
   - 不影响 Command DB 的写入

3. **读副本**
   - 可以为 Query DB 创建多个只读副本
   - 负载均衡分散查询压力

### 写性能考虑

1. **批量同步**
   - 对于大量写入，可以批量同步
   - 减少同步开销

2. **异步同步**
   - 使用消息队列异步处理
   - 提高写入响应速度

## 数据一致性

### 最终一致性

这个架构采用**最终一致性**模型：

- Command DB 是真实数据源（Source of Truth）
- Query DB 最终会与 Command DB 保持一致
- 在同步过程中，可能存在短暂的不一致

### 处理不一致

1. **全量同步接口**
   ```bash
   POST /api/sync/full
   ```
   用于修复数据不一致问题

2. **单项同步接口**
   ```bash
   POST /api/sync/user/:id
   POST /api/sync/post/:id
   ```
   用于修复单个实体的数据

## 扩展可能性

### 1. 多个查询模型

可以为不同的查询场景创建不同的数据库：

```
Command DB (写)
    ↓
    ├→ Query DB 1 (用户查询优化)
    ├→ Query DB 2 (报表统计优化)
    └→ Query DB 3 (全文搜索优化)
```

### 2. 事件日志

在同步过程中记录事件：

```typescript
{
  eventType: 'USER_CREATED',
  aggregateId: 'user-123',
  data: { ... },
  timestamp: '2024-01-01T00:00:00Z',
  version: 1
}
```

可以用于：
- 审计
- 调试
- 重放数据

### 3. 混合 NoSQL

Query DB 不一定要用 PostgreSQL，可以使用：

```
Command DB (PostgreSQL)
    ↓
    ├→ Query DB 1 (PostgreSQL - 关系查询)
    ├→ Query DB 2 (Elasticsearch - 全文搜索)
    └→ Query DB 3 (MongoDB - 聚合文档)
```

## 适用场景

### ✅ 适合使用

1. **读多写少**的应用
2. 需要**复杂查询优化**
3. 需要**读写性能独立扩展**
4. 希望**保持代码简洁**

### ❌ 不适合使用

1. **强一致性**要求（如金融系统）
2. **写操作占多数**
3. **简单的 CRUD** 应用（过度设计）
4. 团队**不熟悉**这种架构

## 与微服务的关系

这个模式可以在微服务中使用：

```
User Service
  ├─ Command DB (users_write)
  └─ Query DB (users_read)

Post Service
  ├─ Command DB (posts_write)
  └─ Query DB (posts_read)
```

每个服务内部使用数据库层面的 CQRS，但对外提供统一的 API。

## 总结

这个实验项目展示了一种**简单实用**的 CQRS 实现方式：

- ✅ 获得读写分离的性能优势
- ✅ 保持代码层面的简洁性
- ✅ 避免过度设计和复杂性
- ✅ 易于理解和维护

记住：**架构是为了解决问题，不是为了炫技。**

