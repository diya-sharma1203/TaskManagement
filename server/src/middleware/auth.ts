import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'developer_secret_key_123456789_team_task_manager') as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin role required' });
  }
};
