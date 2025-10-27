// node modules

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Api is live',
    success: true,
    version: '1.0.0',
    docs: 'to be added ',
    timeStamp: new Date().toISOString(),
  });
});

export default router;
