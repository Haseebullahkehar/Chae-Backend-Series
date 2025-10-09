import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set in environment');
    }

    const connectionInstance = await mongoose.connect(uri, { dbName: DB_NAME });
    console.log(`\n MongoDB connected. Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

