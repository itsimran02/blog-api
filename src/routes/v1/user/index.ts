import deleteUser from '@/controllers/v1/user/delete_current_user';
import getUser from '@/controllers/v1/user/get_current_user';
import updateUser from '@/controllers/v1/user/update_current_user';
import authenticate from '@/middleware/authenticate';
import authorize from '@/middleware/authorize';
import User from '@/models/user';
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';
import { getAllUsers } from '@/controllers/v1/user/get_all_users';

const router = Router();

router.get('/current', authenticate, authorize(['admin', 'user']), getUser);

router.patch(
  '/update',
  authenticate,
  authorize(['admin', 'user']),
  body('userName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('userName must be less than 20 characters')
    .custom(async (value, { req }) => {
      const checkUser = await User.exists({
        userName: value,
        _id: { $ne: req.userId },
      });
      if (checkUser) {
        throw new Error('userName already exists');
      }
    }),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .isEmail()
    .withMessage('please send valid email to update')
    .custom(async (value, { req }) => {
      const checkUser = await User.exists({
        email: value,
        _id: { $ne: req.userId },
      });
      if (checkUser) {
        throw new Error('email already in use');
      }
    }),
  body('newPassword')
    .optional()
    .isLength({ min: 8 })
    .withMessage('password length should be atleast 8 characters')
    .custom(async (_, { req }) => {
      const { userId } = req;
      const { oldPassword } = req.body as {
        oldPassword: string;
      };
      const user = await User.findById(userId)
        .select('password')
        .select('_id')
        .lean()
        .exec();
      if (!user) {
        throw new Error('error while updating the user');
      }
      const decodePass = await bcrypt.compare(oldPassword, user.password);
      if (!decodePass) {
        throw new Error('invalid old password');
      }
    }),
  updateUser,
);
router.get('/', authenticate, authorize(['admin']), getAllUsers);

router.delete(
  '/delete',
  authenticate,
  authorize(['admin', 'user']),
  deleteUser,
);

export default router;
