import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';

export const getUsersForSidebar = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const loggedInUserId = (req.user as IUser)._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error in getUsersForSidebar: ', (error as any).message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
