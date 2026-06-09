import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/traveltales-india',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretjwtkeytraveltalesindia1234!',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
