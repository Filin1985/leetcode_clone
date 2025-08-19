import {Sequelize, DataTypes} from "sequelize";

export interface SolutionAttributes {
  code: string;
  language: string;
  isCorrect: boolean;
  executionTime: number;
}

const Solution = (sequelize: Sequelize) => {
  return sequelize.define('solutions', {
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN
    },
    executionTime: {
      type: DataTypes.FLOAT
    }
  });
};

export default Solution;
