/*
//* @Copyright 2025 imran shaikh
//* @Licensed under the Apache License, Version 2.0
*/
// node moudles
import dotenv from 'dotenv';

// types

import ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: ['http://localhost:300'],
  MONGO_URI: process.env.MONGO_URI,
  LOG_INFO: process.env.LOG_INFO,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  ALLOWED_ADMINS: process.env.ALLOWED_ADMINS,
  RES_OFFSET: process.env.DEFAULT_RESOFFSET,
  RES_LIMIT: process.env.DEFAULT_RESLIMIT,
};

export default config;
