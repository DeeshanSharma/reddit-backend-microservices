import { model, Schema } from 'mongoose';

const commentSchema = new Schema({
  comment: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'posts',
  },
});

const commentModel = model('comments', commentSchema);

export default commentModel;
