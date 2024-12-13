import { IUser } from "../models/userModel"; // Import the IUser interface

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Declare the 'user' property on the Request object
    }
  }
}