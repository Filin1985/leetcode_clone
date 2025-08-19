import { DataTypes, Sequelize } from 'sequelize';


export default (sequelize: Sequelize) => {
  const Comment = sequelize.define('comments', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    }
  });
  return Comment;
};

