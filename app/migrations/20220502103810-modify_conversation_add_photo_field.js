'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn(
          'Conversations', // table name
          'photo', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
        ),
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Conversations', 'photo'),
    ]);
  }
};
