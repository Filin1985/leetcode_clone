import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../../config/config.ts';
import {fileURLToPath} from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db: Record<string, any> = {};

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
} = process.env;

let sequelize: Sequelize;
if (config[env]?.use_env_variable) {
  sequelize = new Sequelize(process.env[config[env].use_env_variable]!, config[env]);
} else {
  sequelize = new Sequelize({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    dialect: 'postgres', // Changed from POSTGRES_DB to 'postgres'
    logging: false,
  });
}

// Import models dynamically
fs.readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  ))
  .forEach(async (file) => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  });
  console.log('Loaded models:', Object.keys(db));
// Set up associations
Object.keys(db).forEach(modelName => {
  console.log(modelName)
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// Define explicit associations
db.User.hasMany(db.Solution, { foreignKey: 'userId' });
db.Solution.belongsTo(db.User, { foreignKey: 'userId' });

db.Problem.hasMany(db.Solution, { foreignKey: 'problemId' });
db.Solution.belongsTo(db.Problem, { foreignKey: 'problemId' });

db.User.hasMany(db.Comment, { foreignKey: 'userId' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId' });

db.Problem.hasMany(db.Comment, { foreignKey: 'problemId' });
db.Comment.belongsTo(db.Problem, { foreignKey: 'problemId' });

db.Problem.belongsToMany(db.Tag, {
  through: 'ProblemTags',
  foreignKey: 'problemId',
});
db.Tag.belongsToMany(db.Problem, {
  through: 'ProblemTags',
  foreignKey: 'tagId',
});

db.User.belongsToMany(db.Material, {
  through: 'UserMaterials',
  foreignKey: 'userId',
});
db.Material.belongsToMany(db.User, {
  through: 'UserMaterials',
  foreignKey: 'materialId',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
