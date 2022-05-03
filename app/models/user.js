'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Conversation, {
        foreignKey:'ownerId'
      })

      User.hasMany(models.Deleted_Messages, {
        foreignKey:'userId'
      })

      User.hasMany(models.Deleted_Conversations, {
        foreignKey:'conversationId'
      })
    }
  }
  User.init({
    phone: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    bio: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
