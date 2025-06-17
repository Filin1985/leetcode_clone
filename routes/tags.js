// routes/tags.js
const express = require("express")
const router = express.Router()
const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProblemsByTag,
} = require("../controllers/tags")
const {authenticate, authorize} = require("../middlewares/auth")
const {validateTag} = require("../validators/tags")

router.get("/", getAllTags)
router.get("/:id/problems", getProblemsByTag)

// Protected routes
router.post(
  "/",
  authenticate,
  authorize(["admin", "interviewer"]),
  validateTag,
  createTag
)
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "interviewer"]),
  validateTag,
  updateTag
)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "interviewer"]),
  deleteTag
)

module.exports = router
