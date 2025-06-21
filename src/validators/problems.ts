import type {Request, Response, NextFunction} from "express";
import { BadRequestError } from "../errors/index.js";

const validateProblem = (req: Request, res: Response, next: NextFunction) => {
  const {title, description, difficulty, testCases, constraints, examples} = req.body;

  if (!title || !description || !difficulty || !testCases || !constraints || !examples) {
    throw new BadRequestError('Missing required fields');
  }

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new BadRequestError('Invalid difficulty level');
  }

  if (!Array.isArray(testCases) || !testCases.length) {
    throw new BadRequestError('Test cases must be a non-empty array');
  }

  if (!Array.isArray(examples) || !examples.length) {
    throw new BadRequestError('Examples must be a non-empty array');
  }

  next();
};

export {validateProblem};