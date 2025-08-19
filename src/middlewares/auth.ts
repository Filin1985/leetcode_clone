import jwt from 'jsonwebtoken';
import jwtSecret from '../config/auth.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';

interface UserPayload {
  id: string;
  role: string;
  [key: string]: unknown;
}

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const decoded = jwt.verify(token, jwtSecret.jwtSecret);
    req.user = decoded as UserPayload;

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

const authorize = (roles: string | string[] = []) => {
  const roleArray = typeof roles === 'string' ? [roles] : roles;
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !roleArray.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

export { authenticate, authorize };
