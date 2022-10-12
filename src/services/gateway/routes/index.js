import express from 'express';
import router from './user.routes';

const router = express.Router();

router.use('/user', router);
router.use('/post', postRouter);
router.use('/subreddit', subredditRouter);

export default router;
