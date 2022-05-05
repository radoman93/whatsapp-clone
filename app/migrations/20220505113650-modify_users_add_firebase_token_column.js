'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn(
          'Users', // table name
          'fbToken', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
        ),
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'fbToken'),
    ]);
  }
};
