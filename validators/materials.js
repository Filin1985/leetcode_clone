// validators/materials.js
const {body} = require("express-validator")
const {BadRequestError} = require("../errors")

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

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array()[0].msg)
    }
    next()
  },
]

module.exports = {validateMaterial}
