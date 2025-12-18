// noe modules
import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';

// custom modules
import User from '@/models/user';

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-__v').lean().exec();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : error,
    });
    logger.error('error  while getting the user');
  }
};

export default getUser;
