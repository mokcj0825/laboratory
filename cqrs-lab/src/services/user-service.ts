/**
 * 用户服务
 * 写操作 -> Command DB，然后同步到 Query DB
 * 读操作 -> Query DB
 */
import { commandDB, queryDB } from '../db';
import { syncService } from '../sync/sync-service';

export class UserService {
  /**
   * 创建用户 (Command)
   */
  async createUser(data: { email: string; name: string }) {
    // 1. 写入 Command DB
    const user = await commandDB.user.create({
      data,
    });

    // 2. 同步到 Query DB
    await syncService.syncUser(user.id);

    return user;
  }

  /**
   * 更新用户 (Command)
   */
  async updateUser(id: string, data: { email?: string; name?: string }) {
    // 1. 更新 Command DB
    const user = await commandDB.user.update({
      where: { id },
      data,
    });

    // 2. 同步到 Query DB
    await syncService.syncUser(user.id);

    return user;
  }

  /**
   * 删除用户 (Command)
   */
  async deleteUser(id: string) {
    // 1. 删除 Command DB（级联删除文章）
    await commandDB.user.delete({
      where: { id },
    });

    // 2. 删除 Query DB
    await syncService.deleteUser(id);

    return { success: true };
  }

  /**
   * 获取单个用户 (Query)
   */
  async getUser(id: string) {
    return queryDB.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  /**
   * 获取所有用户 (Query)
   */
  async getAllUsers() {
    return queryDB.user.findMany({
      include: { posts: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 按邮箱查找用户 (Query)
   */
  async getUserByEmail(email: string) {
    return queryDB.user.findUnique({
      where: { email },
      include: { posts: true },
    });
  }
}

export const userService = new UserService();

