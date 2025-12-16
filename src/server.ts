/*
//* @Copyright 2025 imran shaikh
//* @Licensed under the Apache License, Version 2.0
*/

// custom modules
import app from './app';
import config from '@/config';
import { connectToDatabase, disconnectTheDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

(async () => {
  try {
    // connect the database
    if (config.NODE_ENV !== 'test') {
      await connectToDatabase();
    }

    // start the server
    app.listen(config.PORT, () => {
      logger.info(`your app is running on http://localhost:${config.PORT}`);
    });
  } catch (err) {
    logger.error(
      'failed to start the server',
      err instanceof Error ? err.message : String(err),
    );
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectTheDatabase();
    logger.info('SERVER STOPPED');
    process.exit(0);
  } catch (err) {
    logger.error(err);
  }
};

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
