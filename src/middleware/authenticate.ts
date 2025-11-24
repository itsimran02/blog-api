import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import type { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization as string;

    const jwtPaylod = verifyAccessToken(token) as {
      userId: Types.ObjectId;
    };
    req.userId = jwtPaylod.userId;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'invalid access token ',
        error: error.message,
      });
      return;
    }
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Access token expired ',
        error: error.message,
      });
      return;
    }
    res.status(500).json({
      message: 'internal server error',
      error: error instanceof Error ? error.message : error,
      success: false,
    });
    logger.error('error while authenticating the user');
  }
};

export default authenticate;
