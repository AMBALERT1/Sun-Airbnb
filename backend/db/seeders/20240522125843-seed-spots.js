'use strict';

const images = [
  'images/Downstairs.jepg',
];


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
      previewImage: images/Downstairs.jpeg,
      avgRating: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
   ])
  },

  async down (queryInterface, Sequelize) {
   
  }
};
