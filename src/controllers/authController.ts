import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/userModel';
import generateTokenAndSetCookie from '../utils/generateToken';

const BOY_PIC_URL = process.env.BOY_PIC_URL;
const GIRL_PIC_URL = process.env.GIRL_PIC_URL;

interface SignupRequestBody {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female';
}

export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response,
): Promise<Response> => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `${BOY_PIC_URL}${username}`;
    const girlProfilePic = `${GIRL_PIC_URL}${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error: any) {
    console.log('Error in signup controller', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log('Error in login controller', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const initApp = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Server connection successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Cannot connect to server' });
  }
};
