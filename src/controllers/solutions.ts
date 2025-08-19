import Solution from "../models/index.js";
import Problem from "../models/index.js";
import User from "../models/index.js";
import {NotFoundError} from "../errors/index.js";
import type {Request, Response, NextFunction} from 'express';

interface SolutionAttributes {
  id?: number;
  problemId: number;
  userId: number;
  code: string;
  language: string;
  isCorrect: boolean;
  executionTime: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SolutionResponse {
  message: string;
  solution: {
    id: number;
    isCorrect: boolean;
    executionTime: number;
  };
}

interface ProblemSolutionAttributes {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UserSolutionAttributes {
  id: number;
  username: string;
}

const submitSolution = async (req: Request, res: Response<SolutionResponse>, next: NextFunction) => {
  try {
    const {problemId, code, language} = req.body;

    const problem = await Problem.findByPk(problemId);
    if (!problem) {
      throw new NotFoundError("Problem not found");
    }

    const isCorrect = true;
    const executionTime = 0.42;

    const solution = await Solution.create({
      problemId,
      userId: req.user?.userId,
      code,
      language,
      isCorrect,
      executionTime,
    });

    res.status(201).json({
      message: "Solution submitted successfully",
      solution: {
        id: solution.id,
        isCorrect: solution.isCorrect,
        executionTime: solution.executionTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserSolutions = async (req: Request, res: Response<SolutionAttributes[]>, next: NextFunction) => {
  try {
    const solutions = await Solution.findAll({
      where: {userId: req.user?.userId},
      include: [{
        model: Problem,
        attributes: ["id", "title", "difficulty"],
      }],
      order: [["createdAt", "DESC"]],
    });

    res.json(solutions);
  } catch (error) {
    next(error);
  }
};

const getProblemSolutions = async (req: Request, res: Response<SolutionAttributes[]>, next: NextFunction) => {
  try {
    const solutions = await Solution.findAll({
      where: {problemId: req.params.problemId},
      include: [{
        model: User,
        attributes: ["id", "username"],
      }],
      order: [["executionTime", "ASC"]], // Best solutions first
    });

    res.json(solutions);
  } catch (error) {
    next(error);
  }
};

export {
  submitSolution,
  getUserSolutions,
  getProblemSolutions
};
