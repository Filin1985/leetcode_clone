import User from "../models/index.js";
import Problem from "../models/index.js";
import Solution from "../models/index.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../errors/index.js";
import type { Request, Response, NextFunction } from 'express';
import { Op, WhereOptions } from 'sequelize';
import {ProblemAttributes} from "../models/problem.js";
import {SolutionAttributes} from "../models/solution.js";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  rating: number;
  createdAt: Date;
  createdProblems?: ProblemAttributes[];
  Solutions?: SolutionAttributes[];
}

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  role: string;
  rating: number;
  createdAt: Date;
  isActive: boolean;
}

interface UserResponse {
  total: number;
  pages: number;
  currentPage: number;
  data: UserProfile[];
}

interface PaginationQuery {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const getAllUsers = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response<UserResponse>, next: NextFunction) => {
  try {
    const { role, search, page = 1, limit = 20 }: PaginationQuery = req.query;
    const offset = (page - 1) * limit;

    const where: WhereOptions<UserAttributes> = {
      ...(role ? { role } : {}),
      ...(search
        ? {
            [Op.or]: [
              { username: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };

    const users = await User.findAndCountAll({
      where,
      attributes: ["id", "username", "email", "role", "rating", "createdAt"],
      limit: Number(limit),
      offset: Number(offset),
      order: [["rating", "DESC"]],
    });

    res.json({
      total: users.count,
      pages: Math.ceil(users.count / Number(limit)),
      currentPage: Number(page),
      data: users.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req: Request, res: Response<UserProfile>, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "role", "rating", "createdAt"],
      include: [
        {
          model: Problem,
          attributes: ["id", "title", "difficulty"],
          as: "createdProblems",
        },
        {
          model: Solution,
          attributes: ["id", "isCorrect", "executionTime"],
          include: [
            {
              model: Problem,
              attributes: ["id", "title"],
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req: Request, res: Response<UserProfile>, next: NextFunction) => {
  try {
    // Only admin can update roles
    if (req.user?.role !== "admin") {
      throw new ForbiddenError("Only admin can update user roles");
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { role } = req.body;
    if (!["user", "admin", "interviewer"].includes(role)) {
      throw new BadRequestError("Invalid role");
    }

    await user.update({ role });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserRating = async (req: Request, res: Response<UserProfile>, next: NextFunction) => {
  try {
    // Only interviewers and admin can update ratings
    if (!["admin", "interviewer"].includes(req.user?.role!)) {
      throw new ForbiddenError("Not authorized to update ratings");
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { rating } = req.body;
    if (isNaN(Number(rating)) || Number(rating) < 0) {
      throw new BadRequestError("Invalid rating value");
    }

    await user.update({ rating: Number(rating) });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req: Request, res: Response<{ message: string }>, next: NextFunction) => {
  try {
    // Only admin can deactivate users
    if (req.user?.role !== "admin") {
      throw new ForbiddenError("Only admin can deactivate users");
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.update({ isActive: false });
    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  updateUserRating,
  deactivateUser
};
