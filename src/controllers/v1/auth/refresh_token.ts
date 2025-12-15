// node modules
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
// custom modules
import type { Request, Response } from 'express';
import Token from '@/models/token';
// types

import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import { Types } from 'mongoose';
import { logger } from '@/lib/winston';

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    const tokenExists = await Token.exists({
      token: refreshToken,
    });
    if (!tokenExists) {
      res.clearCookie('refreshToken');
      res.json(401).json({
        success: false,
        message: 'Unauthorized request',
      });
      return;
    }
    const verifyJwt = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };
    const accessToken = generateAccessToken(verifyJwt.userId);
    res.status(200).json({
      accessToken,
    });
    logger.info('access token created successfully');
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        message: 'refresh token is expired please login again',
        success: false,
        error: error.message,
      });
      logger.error('refresh token is expired');

      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        message: 'invalid refresh token',
        success: false,
        error: error.message,
      });
      logger.error('invalid refresh token by user');

      return;
    }
    res.status(500).json({
      message: 'internal server error',
      success: false,
    });
    logger.warn('internal server error on request of new access token');
  }
};

export default refreshToken;
