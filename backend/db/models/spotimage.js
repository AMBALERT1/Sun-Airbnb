'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
   
    static associate(models) {
     SpotImage.hasMany(models.SpotImage, {
      foreignKey: 'spotId',
      as: 'SpotImages',
      onDelete: 'CASCADE',
      hooks: trueche
     })
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};