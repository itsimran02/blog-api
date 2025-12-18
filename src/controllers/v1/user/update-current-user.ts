// node mdoules

// types
import type { Request, Response } from 'express';

// custom modules
import User from '@/models/user';
import { logger } from '@/lib/winston';

const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, userName } = req.body;
    if (!email && !userName) {
      res.status(400).json({
        message: 'please provide username or email to update',
        success: false,
      });
      return;
    }

    const checkEmail = await User.findOne({
      email,
    });

    const checkUserName = await User.findOne({
      userName,
    });

    if (checkEmail) {
      res.status(400).json({
        message: 'please give different email',
        success: false,
      });
      return;
    }
    if (checkUserName) {
      res.status(400).json({
        message: 'please give different userName',
        success: false,
      });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({
        message: 'no user exist to update',
        success: false,
      });
      return;
    }
    if (email) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        { email: email },
        { new: true },
      );
      if (!userName) {
        res.status(201).json({
          message: 'user updated successfully',
          success: true,
          updatedUser,
        });
        return;
      }
    }
    if (userName) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        { userName: userName },
        { new: true },
      );
      res.status(201).json({
        message: 'user updated successfully',
        success: true,
        updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : error,
    });
    logger.error('error  while updating the user');
  }
};

export default updateUser;
