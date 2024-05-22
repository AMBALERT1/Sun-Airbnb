'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Spots', [
    {
      ownerId: 1,
      address: '124 Main St',
      city: 'Anytown',
      state: 'CA',
      country: 'USA',
      lat: 37.7749,
      lng: -122.4194,
      name: 'Wonderful Spot',
      description: 'A beautiful spot in the hear of the city.',
      price: 100.00,
      previewImage: 'images/image1.jpg',
      avgRating: 5,
    },
   ])
  },

  async down (queryInterface, Sequelize) {
   
  }
};
