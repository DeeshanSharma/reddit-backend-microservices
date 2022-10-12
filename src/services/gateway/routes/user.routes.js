import grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import express from 'express';

const packageDefinition = loadSync('../../../protos/user.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = grpc.loadPackageDefinition(packageDefinition);
const userClient = new UserService('localhost:5001', grpc.credentials.createInsecure());

const userRouter = express.Router();

userRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'User id is required' });
  userClient.getUser({ id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.message });
    }
    if (!payload) {
      return res.json({ error: false, code: 404, message: 'User not found' });
    }
    return res.json({ error: false, code: 200, message: 'User found', user: payload });
  });
});

userRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ error: true, code: 400, message: 'Email and password both are required' });
  userClient.createToken({ email, password }, (err, payload) => {
    if (err) {
      console.err(err);
      return res.json({ error: true, code: 500, message: err.message });
    }
    return res.json({ error: false, code: 200, message: 'Token created', token: payload.token });
  });
});

userRouter.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.json({
      error: true,
      code: 400,
      message: 'Username, email and password are required for registration',
    });
  userClient.createUser({ username, email, password }, (err, payload) => {
    if (err) {
      console.err(err);
      return res.json({ error: true, code: 500, message: err.message });
    }
    return res.json({ error: false, code: 200, message: 'Registration successful', user: payload });
  });
});

export default userRouter;
