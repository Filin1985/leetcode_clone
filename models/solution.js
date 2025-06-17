const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Solution = sequelize.define('Solution', {
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

  return Solution;
};