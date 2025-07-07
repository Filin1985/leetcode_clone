
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validator";
import { BadRequestError } from "../errors/index.js";
// @ts-ignore
import {body, validationResult} from "express-validator"

const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3-30 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err: ValidationError) => err.msg);
      throw new BadRequestError(errorMessages.join(", "));
    }
    next();
  },
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password").trim().notEmpty().withMessage("Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err: ValidationError) => err.msg);
      throw new BadRequestError(errorMessages.join(", "));
    }
    next();
  },
];

export { validateRegister, validateLogin };
