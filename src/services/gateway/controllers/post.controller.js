import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync('../../protos/post.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const PostService = loadPackageDefinition(packageDefinition).PostService;
const postClient = new PostService('localhost:5002', credentials.createInsecure());

export const getPost = (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'Post id is required' });
  postClient.getPost({ id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    if (!payload) return res.json({ error: false, code: 404, message: 'Post not found' });
    return res.json({ error: false, code: 200, message: 'Post found', post: payload });
  });
};

export const createPost = (req, res) => {
  const { title, description, subredditId: subreddit } = req.body;
  if (!title || !description || !subreddit)
    return res.json({ error: true, code: 400, message: 'Title, description and subredditId of the post are required' });
  postClient.createPost({ title, description, subreddit, author: req.user.id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'Post created successfully', post: payload });
  });
};

export const updatePost = (req, res) => {
  const { postId, post } = req.body;
  if (!postId || !post)
    return res.json({ error: true, code: 400, message: 'Required fields missing' });
  postClient.updatePost({ postId, userId: req.user.id, post }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'Post updated successfully', post: payload });
  });
};

export const likePost = (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'Post ID must be provided' });
  postClient.likePost({ postId: id, userId: req.user.id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json(payload);
  });
};

export const commentPost = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!id) return res.json({ error: true, code: 400, message: 'Post ID must be provided' });
  if (!comment.trim()) return res.json({ error: true, code: 400, message: 'Valid comment is required' });
  postClient.commentPost({ postId: id, userId: req.user.id, comment }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json(payload);
  });
};
