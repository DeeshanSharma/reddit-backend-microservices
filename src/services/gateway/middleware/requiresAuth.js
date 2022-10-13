import { credentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const packageDefinition = loadSync('../../protos/user.proto', {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = loadPackageDefinition(packageDefinition).UserService;
const userClient = new UserService('localhost:5001', credentials.createInsecure());

const requiresAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ error: true, code: 401, message: 'Unauthorized request' });
  userClient.isAuthenticated({ token }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    if (payload.error) return res.json({ error: true, code: 401, message: 'Unauthorized request' });
    req.user = { id: payload.user.id, username: payload.user.username, email: payload.user.email };
    next();
  });
};

export default requiresAuth;
