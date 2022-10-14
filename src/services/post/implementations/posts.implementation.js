import commentModel from '../models/comment.model.js';
import postModel from '../models/post.model.js';

export const createPost = async (call, cb) => {
  try {
    console.log(call.request);
    const { title, description, author, subreddit } = call.request;
    if (!title || !description) throw new Error('Invalid title or description');
    const post = await postModel.create({ title, description, author, subreddit });
    cb(null, {
      id: post.id,
      title: post.title,
      description: post.description,
      author: post.author,
      subreddit: post.subreddit,
      likes: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const getPost = async (call, cb) => {
  try {
    const { id } = call.request;
    if (!id) throw new Error('Valid post ID must be provided');
    const postPromise = postModel
      .findById(id, { id: '$_id', _id: 0, author: 1, description: 1, title: 1, subreddit: 1, likes: 1 })
      .lean();
    const commentsPromise = commentModel
      .find({ post: id }, { id: '$_id', _id: 0, comment: 1, post: 1, author: 1 })
      .lean();
    const [post, comments] = await Promise.all([postPromise, commentsPromise]);
    cb(null, { post: { ...post, likes: post.likes.length }, comments });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const updatePost = async (call, cb) => {
  try {
    const { postId, userId, post } = call.request;
    if (!postId || !userId || !post) throw new Error('Invalid fields provided');
    const originalPost = await postModel.findById(postId).lean();
    if (originalPost.author.toString() !== userId) throw new Error('Unauthorized');
    const updatedPost = await postModel
      .findByIdAndUpdate(
        postId,
        {
          title: post.title || originalPost.title,
          description: post.description || originalPost.description,
        },
        { new: true }
      )
      .lean();
    cb(null, { ...updatedPost, id: updatedPost._id, likes: updatedPost.likes.length });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const likePost = async (call, cb) => {
  try {
    const { postId, userId } = call.request;
    if (!postId || !userId) throw new Error('Post ID and user ID must be provided');
    const post = await postModel.findById(postId);
    if (!post.likes.includes(userId)) post.likes.push(userId);
    post.save();
    cb(null, { error: false, code: 200, message: 'Post liked' });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const commentPost = async (call, cb) => {
  try {
    const { postId, userId, comment } = call.request;
    if (!postId || !userId || !comment) throw new Error('Missing required fields');
    await commentModel.create({ post: postId, author: userId, comment });
    cb(null, { error: false, code: 200, message: 'Comment posted' });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};
