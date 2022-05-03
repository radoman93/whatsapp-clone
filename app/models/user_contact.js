'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_contact.init({
    userId: DataTypes.INTEGER,
    contactId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_contact',
  });
  return user_contact;
};