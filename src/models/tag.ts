import {DataTypes, Sequelize} from "sequelize"

export interface TagAttributes {
  name: string
}

const Tag = (sequelize: Sequelize) => {
  return sequelize.define("tags", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  })
}

export default Tag
