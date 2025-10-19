#!/bin/bash

# API 测试脚本

BASE_URL="http://localhost:3000"

echo "🧪 Testing CQRS Lab API"
echo "═══════════════════════════════════════════════════════"
echo ""

# 检查服务器
echo "1️⃣  Checking server..."
curl -s $BASE_URL | jq '.'
echo ""

# 创建用户
echo "2️⃣  Creating a user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice"}')
echo $USER_RESPONSE | jq '.'
USER_ID=$(echo $USER_RESPONSE | jq -r '.id')
echo "User ID: $USER_ID"
echo ""

# 获取所有用户
echo "3️⃣  Getting all users..."
curl -s $BASE_URL/api/users | jq '.'
echo ""

# 创建文章
echo "4️⃣  Creating a post..."
POST_RESPONSE=$(curl -s -X POST $BASE_URL/api/posts \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hello CQRS\",\"content\":\"This is a test of database-level CQRS\",\"published\":true,\"authorId\":\"$USER_ID\"}")
echo $POST_RESPONSE | jq '.'
POST_ID=$(echo $POST_RESPONSE | jq -r '.id')
echo "Post ID: $POST_ID"
echo ""

# 获取所有文章
echo "5️⃣  Getting all posts..."
curl -s $BASE_URL/api/posts | jq '.'
echo ""

# 搜索文章
echo "6️⃣  Searching posts..."
curl -s "$BASE_URL/api/posts/search?q=CQRS" | jq '.'
echo ""

# 更新文章
echo "7️⃣  Updating post..."
curl -s -X PUT $BASE_URL/api/posts/$POST_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello CQRS (Updated)","published":true}' | jq '.'
echo ""

# 获取更新后的文章
echo "8️⃣  Getting updated post..."
curl -s $BASE_URL/api/posts/$POST_ID | jq '.'
echo ""

echo "═══════════════════════════════════════════════════════"
echo "✅ API tests completed!"
echo ""
echo "💡 Check the logs to see Command/Query DB operations"
echo ""
echo "To clean up:"
echo "  DELETE post:  curl -X DELETE $BASE_URL/api/posts/$POST_ID"
echo "  DELETE user:  curl -X DELETE $BASE_URL/api/users/$USER_ID"
echo "═══════════════════════════════════════════════════════"

