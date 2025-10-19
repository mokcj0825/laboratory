# CQRS Lab Makefile

.PHONY: help setup start stop clean dev build test-api logs db-push db-studio-command db-studio-query sync-full

help:
	@echo "CQRS Lab - Available Commands"
	@echo "══════════════════════════════════════════════════════"
	@echo "  make setup            - 初始化项目（安装依赖、启动数据库、推送 Schema）"
	@echo "  make start            - 启动数据库容器"
	@echo "  make stop             - 停止数据库容器"
	@echo "  make clean            - 清理数据库和容器"
	@echo "  make dev              - 启动开发服务器"
	@echo "  make build            - 构建生产版本"
	@echo "  make test-api         - 运行 API 测试"
	@echo "  make logs             - 查看容器日志"
	@echo "  make db-push          - 推送数据库 Schema"
	@echo "  make db-studio-command - 打开 Command DB 管理界面"
	@echo "  make db-studio-query   - 打开 Query DB 管理界面"
	@echo "  make sync-full        - 执行全量数据同步"
	@echo "══════════════════════════════════════════════════════"

setup:
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

start:
	@echo "🐘 Starting databases..."
	@docker-compose up -d
	@echo "✓ Databases started"

stop:
	@echo "🛑 Stopping databases..."
	@docker-compose stop
	@echo "✓ Databases stopped"

clean:
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@echo "✓ Cleaned up"

dev:
	@echo "🚀 Starting development server..."
	@npm run dev

build:
	@echo "🔨 Building..."
	@npm run build

test-api:
	@chmod +x scripts/test-api.sh
	@./scripts/test-api.sh

logs:
	@docker-compose logs -f

db-push:
	@echo "📊 Pushing database schemas..."
	@npm run prisma:push

db-studio-command:
	@echo "🎨 Opening Command DB Studio..."
	@npm run prisma:studio:command

db-studio-query:
	@echo "🎨 Opening Query DB Studio..."
	@npm run prisma:studio:query

sync-full:
	@echo "🔄 Triggering full sync..."
	@curl -X POST http://localhost:3000/api/sync/full

