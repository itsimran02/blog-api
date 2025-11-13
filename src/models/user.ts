// node modules

import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  userName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      required: [true, 'userName is required'],
      type: String,
      unique: [true, 'userName must be unique'],
      maxLength: [20, 'userName must be less than 20 characters'],
    },
    email: {
      required: [true, 'Email is required'],
      type: String,
      unique: [true, 'Email must be unique'],
      maxLength: [50, 'Email must be less than 50 characters'],
    },
    password: {
      required: [true, 'password is required'],
      type: String,
      minLength: [8, 'password must be atleast 8 characters'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [20, 'Firstname should be less than 20 characters'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'lastName should be less than 20 characters'],
    },
    socialLinks: {
      facebook: {
        type: String,
        maxLength: [100, 'url should be less than 100 characters'],
      },
      instagram: {
        type: String,
        maxLength: [100, 'url should be less than 100 characters'],
      },
      website: {
        type: String,
        maxLength: [100, 'url should be less than 100 characters'],
      },
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', userSchema);
