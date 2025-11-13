/*
//* @Copyright 2025 imran shaikh
//* @Licensed under the Apache License, Version 2.0
*/

// node modules
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// custom modules
import config from '@/config';
import limiter from '@/lib/express-rate-limiter';
import v1Routes from '@/routes/v1';
import cookieParser from 'cookie-parser';
import { connectToDatabase, disconnectTheDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

// @types
import type { CorsOptions } from 'cors';

// express app
const app = express();

// configure cors options

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.ALLOWED_ORIGINS.includes(origin as string)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `Cors Error ${origin || 'no expected origin found'}  not allowed by CORS`,
        ),
        false,
      );
      logger.warn(
        `Cors Error ${origin || 'no expected origin found'}  not allowed by CORS`,
      );
    }
  },
};
app.use(cookieParser());
app.use(cors(corsOptions));

// setup cors middleware

// /secure http headers
app.use(helmet());

// compress response

app.use(
  compression({
    threshold: 1024,
  }),
);
// add limiter
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes

app.use('/api/v1', v1Routes);

(async () => {
  try {
    // connect the database
    if (config.NODE_ENV !== 'test') {
      connectToDatabase();
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
