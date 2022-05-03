'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deleted_Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Deleted_Conversations.belongsTo(models.User, {
        foreignKey:'userId',
        onDelete: 'CASCADE',
      })

      Deleted_Conversations.belongsTo(models.Conversation, {
        foreignKey:'conversationId',
        onDelete: 'CASCADE',
      })
    }
  }
  Deleted_Conversations.init({
    userId: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deleted_Conversations'
  });
  return Deleted_Conversations;
};
