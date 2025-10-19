/**
 * 用户路由
 */
import { Router, Request, Response } from 'express';
import { userService } from '../services/user-service';

const router = Router();

// 创建用户
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const user = await userService.createUser({ email, name });
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取所有用户
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个用户
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUser(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新用户
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const user = await userService.updateUser(req.params.id, { email, name });
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除用户
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

