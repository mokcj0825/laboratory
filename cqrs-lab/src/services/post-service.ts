/**
 * 文章服务
 * 写操作 -> Command DB，然后同步到 Query DB
 * 读操作 -> Query DB
 */
import { commandDB, queryDB } from '../db';
import { syncService } from '../sync/sync-service';

export class PostService {
  /**
   * 创建文章 (Command)
   */
  async createPost(data: {
    title: string;
    content: string;
    published?: boolean;
    authorId: string;
  }) {
    // 1. 写入 Command DB
    const post = await commandDB.post.create({
      data,
    });

    // 2. 同步到 Query DB
    await syncService.syncPost(post.id);

    return post;
  }

  /**
   * 更新文章 (Command)
   */
  async updatePost(
    id: string,
    data: {
      title?: string;
      content?: string;
      published?: boolean;
    }
  ) {
    // 1. 更新 Command DB
    const post = await commandDB.post.update({
      where: { id },
      data,
    });

    // 2. 同步到 Query DB
    await syncService.syncPost(post.id);

    return post;
  }

  /**
   * 删除文章 (Command)
   */
  async deletePost(id: string) {
    // 1. 删除 Command DB
    await commandDB.post.delete({
      where: { id },
    });

    // 2. 删除 Query DB
    await syncService.deletePost(id);

    return { success: true };
  }

  /**
   * 获取单个文章 (Query)
   */
  async getPost(id: string) {
    return queryDB.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  /**
   * 获取所有文章 (Query)
   */
  async getAllPosts(published?: boolean) {
    return queryDB.post.findMany({
      where: published !== undefined ? { published } : undefined,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 按作者获取文章 (Query)
   */
  async getPostsByAuthor(authorId: string) {
    return queryDB.post.findMany({
      where: { authorId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 搜索文章 (Query - 利用 Query DB 的索引优化)
   */
  async searchPosts(query: string) {
    return queryDB.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const postService = new PostService();

