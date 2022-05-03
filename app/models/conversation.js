'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.belongsTo(models.User, {
        foreignKey:'ownerId',
        onDelete: 'CASCADE',
        as:'owner'
      })

      Conversation.hasMany(models.Participant, {
        foreignKey:'conversationId'
      })

      Conversation.hasMany(models.Message, {
        foreignKey:'conversationId'
      })

      Conversation.hasOne(models.Deleted_Conversations, {
        foreignKey:'conversationId'
      })
    }
  }
  Conversation.init({
    title: DataTypes.STRING,
    ownerId: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
