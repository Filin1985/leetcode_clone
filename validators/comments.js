// validators/comments.js
const {body} = require("express-validator")
const {BadRequestError} = require("../errors")

const validateComment = [
  body("problemId").isInt().withMessage("Invalid problem ID"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({max: 1000})
    .withMessage("Comment cannot exceed 1000 characters"),
  body("rating")
    .optional()
    .isInt({min: 1, max: 5})
    .withMessage("Rating must be between 1 and 5"),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg)
    }
    next()
  },
]

module.exports = {validateComment}
