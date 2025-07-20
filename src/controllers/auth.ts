import jwt from 'jsonwebtoken';
import User from '../models/index.js';
import jwtSecret from '../config/auth.js';
import jwtExpiration from '../config/auth.js';
import {BadRequestError, UnauthorizedError} from '../errors/index.js';
import type {Request, Response, NextFunction} from 'express';

interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: UserPayload;
  token: string;
}

interface JwtPayload {
  userId: string;
  role: string;
}


const register = async (req: Request, res: Response<AuthResponse>, next: NextFunction) => {
  try {
    const {username, email, password, role = 'user'} = req.body;

    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = await User.create({username, email, password, role});

    const token = jwt.sign(
      {userId: user.id, role: user.role} as JwtPayload,
      jwtSecret as unknown as jwt.Secret,
      {expiresIn: jwtExpiration} as unknown as jwt.SignOptions
    );

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response<AuthResponse>, next: NextFunction) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({where: {email}});
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      {userId: user.id, role: user.role} as JwtPayload,
      jwtSecret as unknown as jwt.Secret,
      {expiresIn: jwtExpiration} as unknown as jwt.SignOptions
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response<{message: string;}>, next: NextFunction) => {
  try {
    // In a real app, you might invalidate the token here
    res.json({message: 'Logged out successfully'});
  } catch (error) {
    next(error);
  }
};

export {register, login, logout};