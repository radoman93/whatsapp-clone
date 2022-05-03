'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Conversation, {
        foreignKey:'conversationId'
      })
      Message.belongsTo(models.User, {
        foreignKey:'senderId'
      })

      Message.hasMany(models.Attachment, {
        foreignKey:'messageId'
      })

      Message.hasOne(models.Deleted_Messages, {
        foreignKey: 'messageId'
      })
    }
  }
  Message.init({
    guid: DataTypes.TEXT,
    conversationId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    messageType: {
      type: DataTypes.ENUM,
      values: ["TEXT", "PHOTO", "VIDEO", "VOICE"]
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
