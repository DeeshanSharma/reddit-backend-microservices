import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync('../../protos/subreddit.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const SubredditService = loadPackageDefinition(packageDefinition).SubredditService;
const subredditClient = new SubredditService('localhost:5003', credentials.createInsecure());

export const getSubreddit = (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'Subreddit ID must be provided' });
  subredditClient.getSubreddit({ id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'Subreddit found', subreddit: payload });
  });
};

export const createSubreddit = (req, res) => {
  const { name, description } = req.body;
  if (!name.trim() || !description.trim())
    return res.json({ error: true, code: 400, message: 'Invalid name or description' });
  subredditClient.createSubreddit({ name: name.trim(), description: description.trim() }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'Subreddit created successfully', subreddit: payload });
  });
};
