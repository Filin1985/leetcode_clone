// routes/users.js
const express = require("express")
const router = express.Router()
const {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  updateUserRating,
  deactivateUser,
} = require("../controllers/users")
const {authenticate, authorize} = require("../middlewares/auth")
const {validateUserUpdate} = require("../validators/users")

router.get("/", authenticate, authorize(["admin", "interviewer"]), getAllUsers)
router.get("/:id", authenticate, getUserProfile)

// Admin-only routes
router.put(
  "/:id/role",
  authenticate,
  authorize(["admin"]),
  validateUserUpdate,
  updateUserRole
)
router.put(
  "/:id/rating",
  authenticate,
  authorize(["admin", "interviewer"]),
  validateUserUpdate,
  updateUserRating
)
router.put(
  "/:id/deactivate",
  authenticate,
  authorize(["admin"]),
  deactivateUser
)

module.exports = router
