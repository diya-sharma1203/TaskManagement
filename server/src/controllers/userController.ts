import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getTeamMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await User.find({}).select('-password');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving team members', error });
  }
};
