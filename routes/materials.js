// routes/materials.js
const express = require("express")
const router = express.Router()
const {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materials")
const {authenticate} = require("../middlewares/auth")
const {validateMaterial} = require("../validators/materials")

router.get("/", getAllMaterials)
router.get("/:id", getMaterialById)
router.post("/", authenticate, validateMaterial, createMaterial)
router.put("/:id", authenticate, validateMaterial, updateMaterial)
router.delete("/:id", authenticate, deleteMaterial)

module.exports = router
