import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ProblemAttributes {
  id?: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: object;
  constraints: string;
  examples: object;
  timesSolved: number;
  category: object;
  hints?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProblemCreationAttributes extends Optional<ProblemAttributes, 'id' | 'hints' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Problem extends Model<ProblemAttributes, ProblemCreationAttributes> implements ProblemAttributes {
  declare id: number;
  declare title: string;
  declare description: string;
  declare difficulty: 'easy' | 'medium' | 'hard';
  declare testCases: object;
  declare constraints: string;
  declare examples: object;
  declare timesSolved: number;
  declare category: object;
  declare hints?: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export default function initProblemModel(sequelize: Sequelize): typeof Problem {
  Problem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false
      },
      testCases: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      constraints: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      examples: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      timesSolved: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.ENUM('array', 'promise', 'algorithm', 'interview'),
        allowNull: false
      },
      hints: {
        type: DataTypes.TEXT
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Problem',
      tableName: 'problems',
      timestamps: true
    }
  );

  return Problem;
}