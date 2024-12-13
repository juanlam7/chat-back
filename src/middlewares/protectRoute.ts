import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';

interface JwtPayload {
  userId: string;
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized - No Token Provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(401).json({ error: 'Unauthorized - Invalid Token' });
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    req.user = user as IUser;

    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ', (error as any).message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectRoute;
