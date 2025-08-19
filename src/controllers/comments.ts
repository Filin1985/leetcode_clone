import Comment from "../models/index.js";
import User from "../models/index.js";
import Problem from "../models/index.js";
import { NotFoundError, ForbiddenError } from "../errors/index.js";
import type { Request, Response, NextFunction } from 'express';

export interface CommentAttributes {
  id?: number;
  problemId: number;
  userId: number;
  content: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserAttributes {
  id: number;
  username: string;
}

const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId, content, rating }: CommentAttributes = req.body;

    const problem = await Problem.findByPk(problemId);
    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    const comment = await Comment.create({
      problemId,
      userId: req?.user?.userId,
      content,
      rating,
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ["id", "username"],
      }],
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    next(error);
  }
};

const getProblemComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.findAll({
      where: { problemId: req.params.problemId },
      include: [{
        model: User,
        attributes: ["id", "username"],
      }],
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.userId !== req?.user?.userId && req?.user?.role !== "admin") {
      throw new ForbiddenError("Not authorized to update this comment");
    }

    const { content, rating } = req.body;
    await comment.update({ content, rating });

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.userId !== req?.user?.userId && req?.user?.role !== "admin") {
      throw new ForbiddenError("Not authorized to delete this comment");
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  createComment,
  getProblemComments,
  updateComment,
  deleteComment
};
