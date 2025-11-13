import { Types } from 'mongoose';

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
    }
  }
}
