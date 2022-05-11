'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
        queryInterface.addColumn(
          'Conversations', // table name
          'uuid', // new field name
          {
            type: Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4,
            allowNull: true,
          },
        ),
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Conversations', 'uuid'),
    ]);
  }
};
