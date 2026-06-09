import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './utils';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (config.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Test database connected to MongoMemoryServer:', uri);
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('Successfully connected to MongoDB server');
  } catch (error: any) {
    console.warn(
      `Failed to connect to real MongoDB (${error.message}). Falling back to local MongoMemoryServer...`
    );
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Dev database connected to fallback MongoMemoryServer:', uri);
    } catch (innerError: any) {
      console.error('Failed to start MongoMemoryServer fallback:', innerError.message);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};
