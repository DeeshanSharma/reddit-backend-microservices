import { model, Schema } from 'mongoose';

const subredditSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
});

const subredditModel = model('subreddits', subredditSchema);

export default subredditModel;
