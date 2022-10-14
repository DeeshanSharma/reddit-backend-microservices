import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log('⚡[REDDIT DB]: Database connected successfully');
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
