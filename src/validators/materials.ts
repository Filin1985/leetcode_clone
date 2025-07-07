import type {Request, Response, NextFunction} from "express";
// @ts-ignore
import {body, validationResult} from "express-validator"
import { BadRequestError } from "../errors/index.js";

const validateMaterial = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({max: 100})
    .withMessage("Title cannot exceed 100 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("type")
    .isIn(["article", "video", "cheatsheet"])
    .withMessage("Invalid material type"),

  body("url").optional().isURL().withMessage("Invalid URL format"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg);
    }
    next();
  },
];

export {validateMaterial};
