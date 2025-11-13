// node modules
import mongoose from 'mongoose';

// custom modules

import config from '@/config';

import type { ConnectOptions } from 'mongoose';
import { logger } from '@/lib/winston';

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog Api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('URI is not defined in the configuration');
  }
  try {
    mongoose.connect(config.MONGO_URI as string, clientOptions);
    logger.info('connected to the database', {
      URI: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    logger.error('Error Connecting The Database', err);
  }
};

export const disconnectTheDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('database disconnected successfully', {
      URI: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    logger.error('error in disconnecting the database', err);
  }
};
