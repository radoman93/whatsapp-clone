'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'profilePhoto', {
      type: Sequelize.TEXT,
      defaultValue: 'https://robohash.org/sitestnatus.png?size=50x50&set=set1'
    }).then(function() {
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
