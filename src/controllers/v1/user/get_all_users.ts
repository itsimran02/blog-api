// node modules
// custom  modules
// types
import type { Response, Request } from 'express';
import User from '@/models/user';
import config from '@/config';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit =
      parseInt(req.query.limit as string) ?? Number(config.RES_LIMIT);
    const offset =
      parseInt(req.query.offset as string) ?? Number(config.RES_OFFSET);

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-__v -password')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      message: 'users fetched successfully',
      success: true,
      total: total,
      limit,
      offset,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      success: false,
      error: error instanceof Error ? error.message : 'something went wrong',
    });
  }
};
