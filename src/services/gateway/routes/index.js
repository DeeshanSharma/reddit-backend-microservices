import { Router } from 'express';
import postRouter from './post.routes.js';
import subredditRouter from './subreddit.routes.js';
import userRouter from './user.routes.js';

const router = Router();

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/subreddit', subredditRouter);

export default router;
