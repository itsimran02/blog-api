/*
//* @Copyright 2025 imran shaikh
//* @Licensed under the Apache License, Version 2.0
*/

import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: ['http://localhost:300'],
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
