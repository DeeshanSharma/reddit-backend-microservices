import subredditModel from '../models/subreddit.model.js';

export const createSubreddit = async (call, cb) => {
  try {
    const { name, description, author } = call.request;
    if (!name || !description) throw new Error('Name and description must be provided');
    const subreddit = await subredditModel.create({ name, description, author });
    cb(null, subreddit);
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const getSubreddit = async (call, cb) => {
  try {
    const { id } = call.request;
    if (!id) throw new Error('Subreddit ID must be provided');
    const subreddit = await subredditModel.findById(id).lean();
    cb(null, { ...subreddit, id: subreddit._id });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};
