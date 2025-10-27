// node modules
import { beforeAll, afterAll } from 'vitest';

// custom modules

import { connectToDatabase, disconnectTheDatabase } from '../src/lib/mongoose';

beforeAll(async () => {
  await connectToDatabase();
  console.log('connected to the database');
});

afterAll(async () => {
  await disconnectTheDatabase();

  console.log('disconnected from the database , cleaned up ');
});
