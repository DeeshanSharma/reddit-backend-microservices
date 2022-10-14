import { Router } from 'express';
import { commentPost, createPost, getPost, likePost, updatePost } from '../controllers/post.controller.js';
import requiresAuth from '../middleware/requiresAuth.js';

const postRouter = Router();

postRouter.use((req, res, next) => {
  if (['create', 'update', 'like', 'comment'].includes(req.path.split('/')[1])) requiresAuth(req, res, next);
  else next();
});

postRouter.get('/:id', getPost);

postRouter.post('/create', createPost);

postRouter.put('/update', updatePost);

postRouter.put('/like/:id', likePost);

postRouter.post('/comment/:id', commentPost);

export default postRouter;
