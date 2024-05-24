'use strict';

const { sequelize } = require('../models');

let options = {};
options.tableName = 'Images';
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      preview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Spot',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images', options);
  }
};