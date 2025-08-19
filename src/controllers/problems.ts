
import { NotFoundError, BadRequestError, ForbiddenError } from '../errors/index.js';
import type { Request, Response, NextFunction } from 'express';
import { Includeable, Model, ModelStatic, ModelType, Op, WhereOptions } from 'sequelize';
import {TagAttributes} from '../models/tag.js';
import {CommentAttributes} from './comments.js';
import db from '../models/index.js';
const { Problem, Tag, Comment, User } = db;

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

interface ProblemQuery {
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string;
  search?: string;
  page?: string;
  limit?: string;
}

const getAllProblems = async (req: Request, res: Response<ProblemResponse>, next: NextFunction) => {
  try {
    const {
      difficulty,
      tags,
      search,
      page = '1',
      limit = '10',
    }: ProblemQuery = req.query;
    const pageNumber = Number.isNaN(Number(page)) ? 1 : Number(page);
    const limitNumber = Number.isNaN(Number(limit)) ? 10 : Number(limit);
    const offset = (pageNumber - 1) * limitNumber;
    
    const where: WhereOptions<ProblemAttributes> = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    
    const include: Includeable[] = [];
    if (tags) {
      include.push({
        model: Tag as ModelStatic<Model<TagAttributes>>,
        where: { name: { [Op.in]: tags.split(',') } },
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
    console.log(problems);
    
    res.json({
      total: problems.count,
      page: parseInt(page),
      pages: Math.ceil(problems.count / parseInt(limit)),
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
    const { title, description, difficulty, testCases, constraints, examples, hints, tags }: ProblemAttributes = req.body;
    
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
    
    const { title, description, difficulty, testCases, constraints, examples, hints, tags }: ProblemAttributes = req.body;
    
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
