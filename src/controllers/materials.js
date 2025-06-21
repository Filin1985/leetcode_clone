// controllers/materials.js
const {Material, User} = require("../models")
const {NotFoundError, ForbiddenError, BadRequestError} = require("../errors")

const getAllMaterials = async (req, res, next) => {
  try {
    const {type, search} = req.query
    const where = {}

    if (type) where.type = type
    if (search) where.title = {[Op.iLike]: `%${search}%`}

    const materials = await Material.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.json(materials)
  } catch (error) {
    next(error)
  }
}

const createMaterial = async (req, res, next) => {
  try {
    const {title, content, type, url} = req.body

    if (!title || !content || !type) {
      throw new BadRequestError("Title, content and type are required")
    }

    const material = await Material.create({
      title,
      content,
      type,
      url,
      userId: req.user.userId,
    })

    res.status(201).json(material)
  } catch (error) {
    next(error)
  }
}

const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    })

    if (!material) {
      throw new NotFoundError("Material not found")
    }

    res.json(material)
  } catch (error) {
    next(error)
  }
}

const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id)

    if (!material) {
      throw new NotFoundError("Material not found")
    }

    if (material.userId !== req.user.userId && req.user.role !== "admin") {
      throw new ForbiddenError("Not authorized to update this material")
    }

    const {title, content, type, url} = req.body
    await material.update({title, content, type, url})

    res.json(material)
  } catch (error) {
    next(error)
  }
}

const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id)

    if (!material) {
      throw new NotFoundError("Material not found")
    }

    if (material.userId !== req.user.userId && req.user.role !== "admin") {
      throw new ForbiddenError("Not authorized to delete this material")
    }

    await material.destroy()
    res.json({message: "Material deleted successfully"})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
}
