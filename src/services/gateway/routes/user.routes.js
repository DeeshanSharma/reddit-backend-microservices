import { Router } from 'express';
import { getUser, loginUser, registerUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/:id', getUser);

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

export default userRouter;
