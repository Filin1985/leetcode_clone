import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.js';
import { fileURLToPath } from 'url';

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
    dialect: 'postgres',
    logging: false,
  });
}

// Import models dynamically
const modelFiles = fs.readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    (file.slice(-3) === '.ts' || file.slice(-3) === '.js') && // Check for both .ts and .js
    !file.includes('.test.')
  ));

// Use Promise.all to handle async imports
await Promise.all(modelFiles.map(async (file) => {
  const modelPath = path.join(__dirname, file);
  const modelModule = await import(modelPath); // Use dynamic import instead of require
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}));

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define explicit associations
if (db.User && db.Solution) {
  db.User.hasMany(db.Solution, { foreignKey: 'userId' });
  db.Solution.belongsTo(db.User, { foreignKey: 'userId' });
}

if (db.Problem && db.Solution) {
  db.Problem.hasMany(db.Solution, { foreignKey: 'problemId' });
  db.Solution.belongsTo(db.Problem, { foreignKey: 'problemId' });
}

if (db.User && db.Comment) {
  db.User.hasMany(db.Comment, { foreignKey: 'userId' });
  db.Comment.belongsTo(db.User, { foreignKey: 'userId' });
}

if (db.Problem && db.Comment) {
  db.Problem.hasMany(db.Comment, { foreignKey: 'problemId' });
  db.Comment.belongsTo(db.Problem, { foreignKey: 'problemId' });
}

if (db.Problem && db.Tag) {
  db.Problem.belongsToMany(db.Tag, {
    through: 'problemTags',
    foreignKey: 'problemId',
  });
  db.Tag.belongsToMany(db.Problem, {
    through: 'problemTags',
    foreignKey: 'tagId',
  });
}

if (db.User && db.Material) {
  db.User.belongsToMany(db.Material, {
    through: 'userMaterials',
    foreignKey: 'userId',
  });
  db.Material.belongsToMany(db.User, {
    through: 'userMaterials',
    foreignKey: 'materialId',
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;