// node modules

import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error:
      'you have sent too many requests in given time , please try again letter',
  },
});

export default limiter;
