import Problem from '../models/index.ts';
import Tag from '../models/index.ts';
import Comment from '../models/index.ts';
import User from '../models/index.ts';
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors/index.ts';
import type { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import {TagAttributes} from '../models/tag.ts';
import {CommentAttributes} from './comments.ts';

interface ProblemResponse {
  total: number;
  page: number;
  pages: number;
  data: ProblemAttributes[];
}

interface ProblemAttributes {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: object;
  constraints: string;
  examples: object;
  hints?: string;
  userId: number;
  tags?: TagAttributes[];
  comments?: CommentAttributes[];
}

const getAllProblems = async (req: Request, res: Response<ProblemResponse>, next: NextFunction) => {
  try {
    const { difficulty, tags, search, page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    
    const include: any[] = [];
    if (tags) {
      include.push({
        model: Tag,
        where: { name: { [Op.in]: (tags as string).split(',') } },
        through: { attributes: [] }
      });
    }
    
    const problems = await Problem.findAndCountAll({
      where,
      include,
      limit: parseInt(limit as string),
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      total: problems.count,
      page: parseInt(page as string),
      pages: Math.ceil(problems.count / parseInt(limit as string)),
      data: problems.rows
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req: Request, res: Response<ProblemAttributes>, next: NextFunction) => {
  try {
    const problem = await Problem.findByPk(req.params.id, {
      include: [
        { model: Tag, through: { attributes: [] } },
        { 
          model: Comment,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ]
    });
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    res.json(problem);
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req: Request, res: Response<ProblemAttributes>, next: NextFunction) => {
  try {
    const { title, description, difficulty, testCases, constraints, examples, hints, tags } = req.body;
    
    if (!title || !description || !difficulty || !testCases || !constraints || !examples) {
      throw new BadRequestError('Missing required fields');
    }
    
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases,
      constraints,
      examples,
      hints,
      userId: req.user?.userId
    });
    
    if (tags && tags.length) {
      const tagRecords = await Tag.findAll({ where: { name: tags } });
      await problem.setTags(tagRecords);
    }
    
    res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req: Request, res: Response<ProblemAttributes>, next: NextFunction) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    if (problem.userId !== req.user?.userId && req.user?.role !== 'admin') {
      throw new ForbiddenError('Not authorized to update this problem');
    }
    
    const { title, description, difficulty, testCases, constraints, examples, hints, tags } = req.body;
    
    await problem.update({
      title: title ?? problem.title,
      description: description ?? problem.description,
      difficulty: difficulty ?? problem.difficulty,
      testCases: testCases ?? problem.testCases,
      constraints: constraints ?? problem.constraints,
      examples: examples ?? problem.examples,
      hints: hints ?? problem.hints
    });
    
    if (tags) {
      const tagRecords = await Tag.findAll({ where: { name: tags } });
      await problem.setTags(tagRecords);
    }
    
    res.json(problem);
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req: Request, res: Response<{ message: string }>, next: NextFunction) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    if (problem.userId !== req.user?.userId && req.user?.role !== 'admin') {
      throw new ForbiddenError('Not authorized to delete this problem');
    }
    
    await problem.destroy();
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
};
