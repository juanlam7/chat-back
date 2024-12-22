import { Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateTokenAndSetCookie = (
  userId: mongoose.Types.ObjectId,
  res: Response,
) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    path: '/',
    secure: process.env.NPM_CONFIG_PRODUCTION === 'production',
  });
};

export default generateTokenAndSetCookie;
