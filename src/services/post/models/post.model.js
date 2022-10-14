import { model, Schema } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
      default: [],
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  subreddit: {
    type: Schema.Types.ObjectId,
    ref: 'subreddits',
    required: true,
  },
});

const postModel = model('posts', postSchema);

export default postModel;
