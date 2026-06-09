import app from '../app';
import { connectDB } from '../config/db';
import { config } from '../config/utils';
import { seedDatabase } from '../config/seed';

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const server = app.listen(config.PORT, () => {
    console.log(`=========================================`);
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`=========================================`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('Http server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
