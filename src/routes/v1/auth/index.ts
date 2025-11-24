// node modules
import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';
import { cookie } from 'express-validator';

// custom modules
import register from '@/controllers/v1/auth/register';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import login from '@/controllers/v1/auth/login';
import validationError from '@/middleware/validationError';
import User from '@/models/user';
import logout from '@/controllers/v1/auth/logout';

const router = Router();

router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('please use valid email ')
    .isLength({ max: 50 })
    .withMessage('email must be lesss than 50 characters')
    .custom(async (value) => {
      const userExist = await User.exists({ email: value });
      if (userExist) {
        throw new Error('user already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be atleast 8 characters '),
  body('role')
    .optional()
    .isString()
    .withMessage('role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('role must be either admin or user'),
  validationError,
  register,
);

router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('please use valid email')
    .isLength({ max: 50 })
    .withMessage('email must be lesss than 50 characters')
    .custom(async (value) => {
      const userExist = await User.exists({ email: value });
      if (!userExist) {
        throw new Error('invalid email or password');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be atleast 8 characters ')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email: email })
        .select('password')
        .lean()
        .exec();

      if (!user) {
        throw new Error('invalid email or password');
      }
      const checkPassword = await bcrypt.compare(value, user.password);
      if (!checkPassword) {
        throw new Error('invalid email or password');
      }
    }),
  validationError,
  login,
);

router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('refresh token required')
    .isJWT()
    .withMessage('invalid refresh token'),
  validationError,
  refreshToken,
);

router.post('/logout', logout);

export default router;
