// node modules

import { Router } from 'express';

const router = Router();

// routes

import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Api is live',
    success: true,
    version: '1.0.0',
    docs: 'to be added ',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;
