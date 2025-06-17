const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Problem = sequelize.define('Problem', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    hints: {
      type: DataTypes.TEXT
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Problem;
};