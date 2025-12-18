// node modules
import { logger } from '@/lib/winston';

// custom module
import User from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import Token from '@/models/token';
import config from '@/config';

// types
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type userData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as userData;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'credetntials should not be empty',
      });
      logger.error('credentials are empty');
      return;
    }

    const findUser = await User.findOne({ email: email })
      .select('userName role email password')
      .lean()
      .exec();

    if (!findUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      logger.error('user doesnt exists with this email ');

      return;
    }

    const accessToken = generateAccessToken(findUser._id);
    const refreshToken = generateRefreshToken(findUser._id);

    await Token.findOneAndUpdate(
      { userId: findUser._id },
      { token: refreshToken },
      { upsert: true, new: true },
    );
    logger.info('refresh token created for the user', {
      userId: findUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: config.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'logged in successfully',
      accessToken,
      user: {
        userName: findUser.userName,
        email: findUser.email,
        role: findUser.role,
        userId: findUser._id,
      },
    });
    logger.info('user logged in successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'internal server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export default login;
