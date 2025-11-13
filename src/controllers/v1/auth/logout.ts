// node modules
import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import Token from '@/models/token';
import config from '@/config';

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'No refresh token found',
      });
    }
    await Token.findOneAndDelete({
      token: refreshToken,
    });
    logger.info('user refresh token got deleted', {
      userId: req.userId,
      token: refreshToken,
    });
    res.clearCookie('refreshToken', {
      sameSite: 'strict',
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
    });
    res.status(201).json({
      message: 'user logged out successully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : 'something went wrong',
    });
    logger.error('error while logging out the user');
  }
};

export default logout;
