import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const createUser = async (call, cb) => {
  try {
    const { username, email, password } = call.request;
    if (!username || !email || !password) throw new Error('Provide valid fields');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await userModel.create({ username, email, password: hash });
    cb(null, user);
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const getUser = async (call, cb) => {
  try {
    const { id } = call.request;
    if (!id) throw new Error('Provide a valid user ID');
    const user = await userModel.findById(id, { id: '$_id', _id: 0, email: 1, username: 1 }).lean();
    if (!user) throw new Error('User not found');
    cb(null, user);
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const createToken = async (call, cb) => {
  try {
    const { email, password } = call.request;
    if (!email || !password) throw new Error('Provide a valid email and password');
    const user = await userModel.findOne({ email }, { id: '$_id', _id: 0, email: 1, username: 1, password: 1 }).lean();
    if (!user) throw new Error('You are not registered yet');
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET_KEY);
    cb(null, { token });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};

export const isAuthenticated = async (call, cb) => {
  try {
    const { token } = call.request;
    if (!token) throw new Error('Invalid token');
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!payload) throw new Error('Invalid token');
    const user = await userModel.findById(payload.id, { id: '$_id', _id: 0, email: 1, username: 1 }).lean();
    if (!user) throw new Error('Unauthorized');
    cb(null, { error: false, user });
  } catch (error) {
    console.error(error);
    cb(error, null);
  }
};
