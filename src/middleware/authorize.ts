import { logger } from '@/lib/winston';
import User from '@/models/user';
import type { NextFunction, Request, Response } from 'express';

export type authRole = 'admin' | 'user';

const authorize = (role: authRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId).select('role').exec();
      if (!user) {
        res.status(404).json({
          message: 'User not found',
          success: false,
        });
        return;
      }
      if (!role.includes(user.role)) {
        res.status(403).json({
          message: 'access denied , insufficient permission',
          sucess: false,
        });
        return;
      }
      return next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'internal server error',
        error: err instanceof Error ? err.message : err,
      });

      logger.error('error on authorizing the user');
    }
  };
};

export default authorize;
