import grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import express from 'express';

const packageDefinition = loadSync('../../../protos/post.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const PostService = grpc.loadPackageDefinition(packageDefinition);
const postClient = new PostService('localhost:5002', grpc.credentials.createInsecure());

const postRouter = express.Router();

postRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'Post id is required' });
  postClient.getPost({ id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.message });
    }
    if (!payload) return res.json({ error: false, code: 404, message: 'Post not found' });
    return res.json({ error: false, code: 200, message: 'Post found', post: payload });
  });
});

postRouter.post('/create', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.json({ error: true, code: 400, message: 'Title and description of the post are required' });
  postClient.createPost({ title, description }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.message });
    }
    return res.json({ error: false, code: 200, message: 'Post created successfully', post: payload });
  });
});

postRouter.put('/update', (req, res) => {
  const { postId, userId, post } = req.body;
  if (!postId || !userId || !post || !post.title || !post.description)
    return res.json({ error: true, code: 400, message: 'Required fields missing' });
});

export default postRouter;
