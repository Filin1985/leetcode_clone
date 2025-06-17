// validators/tags.js
const {body} = require("express-validator")
const {BadRequestError} = require("../errors")

const validateTag = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tag name is required")
    .isLength({min: 2, max: 30})
    .withMessage("Tag name must be between 2-30 characters")
    .matches(/^[a-zA-Z0-9\- ]+$/)
    .withMessage(
      "Tag name can only contain letters, numbers, hyphens and spaces"
    ),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg)
    }
    next()
  },
]

module.exports = {validateTag}
