#!/bin/bash

# CQRS Lab 设置脚本

set -e

echo "🚀 Setting up CQRS Lab..."
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Docker and Node.js are installed"
echo ""

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

if [ ! -f .env.command ]; then
    echo "📝 Creating .env.command file..."
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/command_db?schema=public"' > .env.command
fi

if [ ! -f .env.query ]; then
    echo "📝 Creating .env.query file..."
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5433/query_db?schema=public"' > .env.query
fi

echo "✓ Environment files created"
echo ""

# 安装依赖
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# 启动数据库
echo "🐘 Starting PostgreSQL databases..."
docker-compose up -d
echo "✓ Databases started"
echo ""

# 等待数据库启动
echo "⏳ Waiting for databases to be ready..."
sleep 5

# 生成 Prisma Client
echo "🔧 Generating Prisma clients..."
npx prisma generate --schema=./prisma/schema-command.prisma
npx prisma generate --schema=./prisma/schema-query.prisma
echo "✓ Prisma clients generated"
echo ""

# 推送 Schema
echo "📊 Pushing database schemas..."
npm run prisma:push
echo "✓ Schemas pushed"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "✅ CQRS Lab setup completed!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📡 Command DB: postgresql://localhost:5432/command_db"
echo "📖 Query DB:   postgresql://localhost:5433/query_db"
echo ""
echo "To start the server, run:"
echo "  npm run dev"
echo ""
echo "To view databases, run:"
echo "  npm run prisma:studio:command  # View Command DB"
echo "  npm run prisma:studio:query    # View Query DB"
echo ""
echo "═══════════════════════════════════════════════════════"

