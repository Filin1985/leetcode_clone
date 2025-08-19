// @ts-ignore
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/index.js";
const validateUserUpdate = [
    body("role")
        .optional()
        .isIn(["user", "admin", "interviewer"])
        .withMessage("Invalid role"),
    body("rating")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Rating must be a positive number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }
        next();
    },
];
export { validateUserUpdate };
