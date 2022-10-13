import { Router } from 'express';
import { createSubreddit, getSubreddit } from '../controllers/subreddit.controller.js';
import requiresAuth from '../middleware/requiresAuth.js';

const subredditRouter = Router();

subredditRouter.get('/:id', getSubreddit);

subredditRouter.post('/create', requiresAuth, createSubreddit);

export default subredditRouter;
