// node modules
import jwt from 'jsonwebtoken';

// custome modules
import config from '@/config';
import { logger } from '@/lib//winston';

// types
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  if (!config.JWT_ACCESS_SECRET) {
    logger.error('JWT secret isnt defined');
    throw new Error(
      'JWT_ACCESS_SECRET is not defined in environment variables',
    );
  }

  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  if (!config.JWT_REFRESH_SECRET) {
    logger.error('JWT secret isnt defined');
    throw new Error(
      'JWT_ACCESS_SECRET is not defined in environment variables',
    );
  }

  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as string);
};
