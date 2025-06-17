// controllers/tags.js
const {Tag, Problem} = require("../models")
const {NotFoundError, BadRequestError} = require("../errors")

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Problem,
          attributes: [],
          through: {attributes: []},
        },
      ],
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("Problems.id")), "problemCount"],
      ],
      group: ["Tag.id"],
      order: [[sequelize.literal("problemCount"), "DESC"]],
    })

    res.json(tags)
  } catch (error) {
    next(error)
  }
}

const createTag = async (req, res, next) => {
  try {
    const {name} = req.body

    if (!name) {
      throw new BadRequestError("Tag name is required")
    }

    const tag = await Tag.create({name})
    res.status(201).json(tag)
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      next(new BadRequestError("Tag already exists"))
    } else {
      next(error)
    }
  }
}

const updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) {
      throw new NotFoundError("Tag not found")
    }

    const {name} = req.body
    await tag.update({name})
    res.json(tag)
  } catch (error) {
    next(error)
  }
}

const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id)
    if (!tag) {
      throw new NotFoundError("Tag not found")
    }

    await tag.destroy()
    res.json({message: "Tag deleted successfully"})
  } catch (error) {
    next(error)
  }
}

const getProblemsByTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Problem,
          through: {attributes: []},
          where: {isActive: true},
        },
      ],
    })

    if (!tag) {
      throw new NotFoundError("Tag not found")
    }

    res.json(tag.Problems)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProblemsByTag,
}
