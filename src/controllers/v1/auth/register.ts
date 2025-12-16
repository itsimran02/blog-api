// node modules
import { logger } from '@/lib/winston';

// custom modules
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import config from '@/config';
import { generateUserName } from '@/utils/index';
import User from '@/models/user';
import Token from '@/models/token';

// types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type userData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role }: userData = req.body;
    if (role === 'admin' && !config.ALLOWED_ADMINS?.includes(email)) {
      res.status(403).json({
        success: false,
        error: 'validation error',
        messgae: `role admin is not allowed for ${email}`,
      });
      logger.error('user is trying to access role admin');
      return;
    }
    const userName = generateUserName();

    const newUser = await User.create({
      email,
      password,
      role,
      userName,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: config.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      user: {
        email: newUser.email,
        role: newUser.role,
        userName: newUser.userName,
      },
      accessToken,
    });

    logger.info('user registered successfully', {
      email: newUser.email,
      role: newUser.role,
      userName: newUser.userName,
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
      return;
    }

    res.status(500).json({
      message: 'internal server error',
      err: err instanceof Error ? err.message : err,
      success: false,
    });
    logger.error('Error during user registration', err);
  }
};

export default register;
