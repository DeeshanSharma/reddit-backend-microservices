import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: (email) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/.test(email),
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
});

const userModel = model('users', userSchema);

export default userModel;
