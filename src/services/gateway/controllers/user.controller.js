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

export const getUser = (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ error: true, code: 400, message: 'User id is required' });
  userClient.getUser({ id }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'User found', user: payload });
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return res.json({ error: true, code: 400, message: 'Email and password both are required' });
  userClient.createToken({ email: email.trim(), password: password.trim() }, (err, payload) => {
    if (err) {
      console.error(err);
      return res.json({ error: true, code: 500, message: err.details });
    }
    return res.json({ error: false, code: 200, message: 'Token created', token: payload.token });
  });
};

export const registerUser = (req, res) => {
  const { username, email, password } = req.body;
  if (!username.trim() || !email.trim() || !password.trim())
    return res.json({
      error: true,
      code: 400,
      message: 'Username, email and password are required for registration',
    });
  userClient.createUser(
    { username: username.trim(), email: email.trim(), password: password.trim() },
    (err, payload) => {
      if (err) {
        console.error(err);
        return res.json({ error: true, code: 500, message: err.details });
      }
      return res.json({ error: false, code: 200, message: 'Registration successful', user: payload });
    }
  );
};
