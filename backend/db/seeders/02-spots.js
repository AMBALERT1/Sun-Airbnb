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
      description: 'A beautiful spot in the heart of the city.',
      price: 100.00,
    },
    {
      ownerId: 2,
      address: '165 Main St',
      city: 'Happy',
      state: 'TX',
      country: 'USA',
      lat: 38.8849,
      lng: -100.4194,
      name: 'Wonder World',
      description: 'A beautiful spot located 10 mintues from the Houston Airport and 5 mintues from the mall.',
      price: 250.00,
    },
    {
      ownerId: 3,
      address: '187 North St',
      city: 'Cary',
      state: 'NC',
      country: 'USA',
      lat: 56.7789,
      lng: -135.4890,
      name: 'Home Away From Home',
      description: 'Looking for a quick getway from the world, then look no further. This wonderful spot is located just a few blocks away from southpoint mall',
      price: 150.00,
    }
   ])
  },
  async down (queryInterface, Sequelize) { 
  }
};
