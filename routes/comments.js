// routes/comments.js
const express = require("express")
const router = express.Router()
const {
  createComment,
  getProblemComments,
  updateComment,
  deleteComment,
} = require("../controllers/comments")
const {authenticate} = require("../middlewares/auth")
const {validateComment} = require("../validators/comments")

router.post("/", authenticate, validateComment, createComment)
router.get("/problem/:problemId", authenticate, getProblemComments)
router.put("/:id", authenticate, validateComment, updateComment)
router.delete("/:id", authenticate, deleteComment)

module.exports = router
