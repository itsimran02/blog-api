import { logger } from '@/lib/winston';
import User from '@/models/user';
import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      res.status(404).json({
        message: 'user not found',
        success: false,
      });
      logger.error('error deleting the user ');
    }
    res.status(204).json({
      message: 'user deleted successfully',
      success: true,
      user: deletedUser,
    });
    logger.info('user deleted successfully', deletedUser);
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : error,
    });
    logger.error('error  while deleting the user');
  }
};

export default deleteUser;
