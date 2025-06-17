// controllers/comments.js
const {Comment, User, Problem} = require("../models")
const {NotFoundError, ForbiddenError} = require("../errors")

const createComment = async (req, res, next) => {
  try {
    const {problemId, content, rating} = req.body

    const problem = await Problem.findByPk(problemId)
    if (!problem) {
      throw new NotFoundError("Problem not found")
    }

    const comment = await Comment.create({
      problemId,
      userId: req.user.userId,
      content,
      rating,
    })

    // Include user details in the response
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    })

    res.status(201).json(commentWithUser)
  } catch (error) {
    next(error)
  }
}

const getProblemComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {problemId: req.params.problemId},
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(comments)
  } catch (error) {
    next(error)
  }
}

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id)

    if (!comment) {
      throw new NotFoundError("Comment not found")
    }

    // Only allow author or admin to update
    if (comment.userId !== req.user.userId && req.user.role !== "admin") {
      throw new ForbiddenError("Not authorized to update this comment")
    }

    const {content, rating} = req.body
    await comment.update({content, rating})

    res.json(comment)
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id)

    if (!comment) {
      throw new NotFoundError("Comment not found")
    }

    // Only allow author or admin to delete
    if (comment.userId !== req.user.userId && req.user.role !== "admin") {
      throw new ForbiddenError("Not authorized to delete this comment")
    }

    await comment.destroy()
    res.json({message: "Comment deleted successfully"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  getProblemComments,
  updateComment,
  deleteComment,
}
