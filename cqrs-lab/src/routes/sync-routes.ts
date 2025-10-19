/**
 * 同步路由
 * 提供手动同步接口，用于数据修复或初始化
 */
import { Router, Request, Response } from 'express';
import { syncService } from '../sync/sync-service';

const router = Router();

// 全量同步
router.post('/full', async (req: Request, res: Response) => {
  try {
    await syncService.fullSync();
    res.json({ success: true, message: 'Full sync completed' });
  } catch (error: any) {
    console.error('Full sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 同步单个用户
router.post('/user/:id', async (req: Request, res: Response) => {
  try {
    await syncService.syncUser(req.params.id);
    res.json({ success: true, message: 'User synced' });
  } catch (error: any) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 同步单个文章
router.post('/post/:id', async (req: Request, res: Response) => {
  try {
    await syncService.syncPost(req.params.id);
    res.json({ success: true, message: 'Post synced' });
  } catch (error: any) {
    console.error('Sync post error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

