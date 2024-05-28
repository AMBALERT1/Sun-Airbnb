'use strict';
const {
  Model
} = require('sequelize');
const { all } = require('../../routes');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      review.belongsTo(models.user, { foreignKey: 'userId' });
      review.belongsTo(models.spot, { foreignKey: 'spotId' });
      
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spot',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      },
      createdAt: {
        type: DataTypes.Date,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
       },
       updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
       }
    }
  }, {
    sequelize,
    modelName: 'Review',
    timestamps: true 
  });
  return Review;
};