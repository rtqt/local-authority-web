
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Infrastructure',
        description: 'Roads, bridges, utilities, and public facilities'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Public Safety',
        description: 'Crime, accidents, and emergency situations'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Environmental',
        description: 'Pollution, waste management, and environmental concerns'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Transportation',
        description: 'Traffic, public transport, and parking issues'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Health & Sanitation',
        description: 'Public health and cleanliness issues'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Utilities',
        description: 'Water, electricity, gas, and telecommunications'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Parks & Recreation',
        description: 'Public parks, recreational facilities, and green spaces'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Housing',
        description: 'Housing conditions and residential concerns'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Education',
        description: 'Schools, libraries, and educational facilities'
      },
      {
        category_id: Sequelize.literal('gen_random_uuid()'),
        name: 'Other',
        description: 'Issues that do not fit into other categories'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
