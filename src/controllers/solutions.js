// controllers/solutions.js
const {Solution, Problem, User} = require("../models")
const {NotFoundError, ForbiddenError} = require("../errors")

const submitSolution = async (req, res, next) => {
  try {
    const {problemId, code, language} = req.body

    const problem = await Problem.findByPk(problemId)
    if (!problem) {
      throw new NotFoundError("Problem not found")
    }

    // In a real implementation, you would run the code against test cases
    const isCorrect = true // Placeholder - replace with actual validation
    const executionTime = 0.42 // Placeholder - replace with actual measurement

    const solution = await Solution.create({
      problemId,
      userId: req.user.userId,
      code,
      language,
      isCorrect,
      executionTime,
    })

    res.status(201).json({
      message: "Solution submitted successfully",
      solution: {
        id: solution.id,
        isCorrect: solution.isCorrect,
        executionTime: solution.executionTime,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getUserSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.findAll({
      where: {userId: req.user.userId},
      include: [
        {
          model: Problem,
          attributes: ["id", "title", "difficulty"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(solutions)
  } catch (error) {
    next(error)
  }
}

const getProblemSolutions = async (req, res, next) => {
  try {
    const solutions = await Solution.findAll({
      where: {problemId: req.params.problemId},
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["executionTime", "ASC"]], // Best solutions first
    })

    res.json(solutions)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  submitSolution,
  getUserSolutions,
  getProblemSolutions,
}
