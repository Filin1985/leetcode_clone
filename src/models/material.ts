import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface MaterialAttributes {
  id?: number;
  title: string;
  content: string;
  type: 'article' | 'video' | 'cheatsheet';
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MaterialCreationAttributes extends Optional<MaterialAttributes, 'id' | 'url' | 'createdAt' | 'updatedAt'> {}

class Material extends Model<MaterialAttributes, MaterialCreationAttributes> implements MaterialAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public type!: 'article' | 'video' | 'cheatsheet';
  public url?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initMaterialModel(sequelize: Sequelize): typeof Material {
  Material.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Material',
      tableName: 'materials',
      timestamps: true
    }
  );

  return Material;
}
