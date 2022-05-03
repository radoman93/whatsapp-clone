'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn(
          'Users', // table name
          'bio', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
        ),
      queryInterface.addColumn(
        'Users', // table name
        'status', // new field name
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
      queryInterface.removeColumn('Users', 'bio'),
      queryInterface.removeColumn('Users', 'status'),
    ]);
  }
};
