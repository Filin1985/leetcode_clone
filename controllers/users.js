// controllers/users.js
const {User, Problem, Solution, Comment} = require("../models")
const {NotFoundError, ForbiddenError, BadRequestError} = require("../errors")

const getAllUsers = async (req, res, next) => {
  try {
    const {role, search, page = 1, limit = 20} = req.query
    const offset = (page - 1) * limit

    const where = {}
    if (role) where.role = role
    if (search) {
      where[Op.or] = [
        {username: {[Op.iLike]: `%${search}%`}},
        {email: {[Op.iLike]: `%${search}%`}},
      ]
    }

    const users = await User.findAndCountAll({
      where,
      attributes: ["id", "username", "email", "role", "rating", "createdAt"],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["rating", "DESC"]],
    })

    res.json({
      total: users.count,
      pages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      data: users.rows,
    })
  } catch (error) {
    next(error)
  }
}

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "role", "rating", "createdAt"],
      include: [
        {
          model: Problem,
          attributes: ["id", "title", "difficulty"],
          as: "createdProblems",
        },
        {
          model: Solution,
          attributes: ["id", "isCorrect", "executionTime"],
          include: [
            {
              model: Problem,
              attributes: ["id", "title"],
            },
          ],
        },
      ],
    })

    if (!user) {
      throw new NotFoundError("User not found")
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateUserRole = async (req, res, next) => {
  try {
    // Only admin can update roles
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Only admin can update user roles")
    }

    const user = await User.findByPk(req.params.id)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const {role} = req.body
    if (!["user", "admin", "interviewer"].includes(role)) {
      throw new BadRequestError("Invalid role")
    }

    await user.update({role})
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateUserRating = async (req, res, next) => {
  try {
    // Only interviewers and admin can update ratings
    if (!["admin", "interviewer"].includes(req.user.role)) {
      throw new ForbiddenError("Not authorized to update ratings")
    }

    const user = await User.findByPk(req.params.id)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const {rating} = req.body
    if (isNaN(rating) || rating < 0) {
      throw new BadRequestError("Invalid rating value")
    }

    await user.update({rating})
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const deactivateUser = async (req, res, next) => {
  try {
    // Only admin can deactivate users
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Only admin can deactivate users")
    }

    const user = await User.findByPk(req.params.id)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    await user.update({isActive: false})
    res.json({message: "User deactivated successfully"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  updateUserRating,
  deactivateUser,
}
