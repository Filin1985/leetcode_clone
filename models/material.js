const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Material = sequelize.define('Material', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('article', 'video', 'cheatsheet'),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    }
  });

  return Material;
};