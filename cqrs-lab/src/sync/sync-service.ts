/**
 * 数据同步服务
 * 负责将 Command DB 的写操作同步到 Query DB
 */
import { commandDB, queryDB } from '../db';

export class SyncService {
  /**
   * 同步用户数据
   */
  async syncUser(userId: string) {
    try {
      const user = await commandDB.user.findUnique({
        where: { id: userId },
        include: { posts: true },
      });

      if (!user) {
        // 如果 Command DB 中没有该用户，则从 Query DB 删除
        await queryDB.user.delete({
          where: { id: userId },
        }).catch(() => {
          // 如果 Query DB 中也没有，忽略错误
        });
        return;
      }

      // 使用 upsert 确保数据存在则更新，不存在则创建
      await queryDB.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          name: user.name,
          updatedAt: user.updatedAt,
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      console.log(`✓ User synced: ${userId}`);
    } catch (error) {
      console.error(`✗ Failed to sync user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 同步文章数据
   */
  async syncPost(postId: string) {
    try {
      const post = await commandDB.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        // 如果 Command DB 中没有该文章，则从 Query DB 删除
        await queryDB.post.delete({
          where: { id: postId },
        }).catch(() => {
          // 如果 Query DB 中也没有，忽略错误
        });
        return;
      }

      // 使用 upsert 确保数据存在则更新，不存在则创建
      await queryDB.post.upsert({
        where: { id: post.id },
        update: {
          title: post.title,
          content: post.content,
          published: post.published,
          authorId: post.authorId,
          updatedAt: post.updatedAt,
        },
        create: {
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
      });

      console.log(`✓ Post synced: ${postId}`);
    } catch (error) {
      console.error(`✗ Failed to sync post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * 删除用户（包括其所有文章）
   */
  async deleteUser(userId: string) {
    try {
      await queryDB.user.delete({
        where: { id: userId },
      });
      console.log(`✓ User deleted from Query DB: ${userId}`);
    } catch (error) {
      console.error(`✗ Failed to delete user from Query DB ${userId}:`, error);
      throw error;
    }
  }

  /**
   * 删除文章
   */
  async deletePost(postId: string) {
    try {
      await queryDB.post.delete({
        where: { id: postId },
      });
      console.log(`✓ Post deleted from Query DB: ${postId}`);
    } catch (error) {
      console.error(`✗ Failed to delete post from Query DB ${postId}:`, error);
      throw error;
    }
  }

  /**
   * 全量同步（用于初始化或修复数据不一致）
   */
  async fullSync() {
    console.log('Starting full sync...');
    
    try {
      // 同步所有用户
      const users = await commandDB.user.findMany();
      for (const user of users) {
        await this.syncUser(user.id);
      }

      // 同步所有文章
      const posts = await commandDB.post.findMany();
      for (const post of posts) {
        await this.syncPost(post.id);
      }

      console.log('✓ Full sync completed');
    } catch (error) {
      console.error('✗ Full sync failed:', error);
      throw error;
    }
  }
}

export const syncService = new SyncService();

