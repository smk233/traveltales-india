import mongoose from 'mongoose';
import { config } from './utils';

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Successfully connected to MongoDB');
  } catch (error: any) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};