import type { Response, Request } from 'express';
import User from '@/models/user';
import { Types } from 'mongoose';
const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'invalid user id',
      });
    }

    const user = await User.findById(userId)
      .select('-__v -password')
      .lean()
      .exec();
    if (!user) {
      res.status(404).json({
        message: 'canot find user details',
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: 'user fetched successfully',
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : 'something went wrong',
    });
  }
};

export default getUserById;
