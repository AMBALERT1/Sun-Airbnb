'use strict';
const {
  Model
} = require('sequelize');
const { all } = require('../../routes');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Spot, {foreignKey: 'spotId', onDelete: 'CASCADE'})
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spot',
        key: 'id'
      },
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};