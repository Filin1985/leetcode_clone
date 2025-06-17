// validators/users.js
const {body} = require("express-validator")
const {BadRequestError} = require("../errors")

const validateUserUpdate = [
  body("role")
    .optional()
    .isIn(["user", "admin", "interviewer"])
    .withMessage("Invalid role"),

  body("rating")
    .optional()
    .isFloat({min: 0})
    .withMessage("Rating must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg)
    }
    next()
  },
]

module.exports = {validateUserUpdate}
