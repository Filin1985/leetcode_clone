require('dotenv').config();
const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || "development"
const config = require(__dirname + "/../config/config.js")[env]
const db = {}

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
} = process.env

let sequelize
if (config?.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  console.log(POSTGRES_USER)
  sequelize = new Sequelize({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    dialect: POSTGRES_DB,
  })
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Устанавливаем ассоциации
db.User.hasMany(db.Solution, {foreignKey: "userId"})
db.Solution.belongsTo(db.User, {foreignKey: "userId"})

db.Problem.hasMany(db.Solution, {foreignKey: "problemId"})
db.Solution.belongsTo(db.Problem, {foreignKey: "problemId"})

db.User.hasMany(db.Comment, {foreignKey: "userId"})
db.Comment.belongsTo(db.User, {foreignKey: "userId"})

db.Problem.hasMany(db.Comment, {foreignKey: "problemId"})
db.Comment.belongsTo(db.Problem, {foreignKey: "problemId"})

db.Problem.belongsToMany(db.Tag, {
  through: "ProblemTags",
  foreignKey: "problemId",
})
db.Tag.belongsToMany(db.Problem, {through: "ProblemTags", foreignKey: "tagId"})

db.User.belongsToMany(db.Material, {
  through: "UserMaterials",
  foreignKey: "userId",
})
db.Material.belongsToMany(db.User, {
  through: "UserMaterials",
  foreignKey: "materialId",
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
