/**
 * 文章路由
 */
import { Router, Request, Response } from 'express';
import { postService } from '../services/post-service';

const router = Router();

// 创建文章
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, published, authorId } = req.body;
    
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required' });
    }

    const post = await postService.createPost({
      title,
      content,
      published: published ?? false,
      authorId,
    });
    
    res.status(201).json(post);
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取所有文章（可选过滤已发布）
router.get('/', async (req: Request, res: Response) => {
  try {
    const published = req.query.published === 'true' ? true : 
                     req.query.published === 'false' ? false : 
                     undefined;
    
    const posts = await postService.getAllPosts(published);
    res.json(posts);
  } catch (error: any) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 搜索文章
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const posts = await postService.searchPosts(query);
    res.json(posts);
  } catch (error: any) {
    console.error('Search posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个文章
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await postService.getPost(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error: any) {
    console.error('Get post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新文章
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, content, published } = req.body;
    const post = await postService.updatePost(req.params.id, {
      title,
      content,
      published,
    });
    res.json(post);
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 删除文章
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await postService.deletePost(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 按作者获取文章
router.get('/author/:authorId', async (req: Request, res: Response) => {
  try {
    const posts = await postService.getPostsByAuthor(req.params.authorId);
    res.json(posts);
  } catch (error: any) {
    console.error('Get posts by author error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

