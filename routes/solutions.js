// routes/solutions.js
const express = require("express")
const router = express.Router()
const {
  submitSolution,
  getUserSolutions,
  getProblemSolutions,
} = require("../controllers/solutions")
const {authenticate} = require("../middlewares/auth")

router.post("/", authenticate, submitSolution)
router.get("/my", authenticate, getUserSolutions)
router.get("/problem/:problemId", authenticate, getProblemSolutions)

module.exports = router
