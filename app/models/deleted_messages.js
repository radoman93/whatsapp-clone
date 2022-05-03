'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deleted_Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Deleted_Messages.belongsTo(models.User, {
        foreignKey:'userId',
        onDelete: 'CASCADE',
        as:'owner'
      })

      Deleted_Messages.belongsTo(models.Message, {
        foreignKey:'messageId',
        onDelete: 'CASCADE',
      })
    }
  }
  Deleted_Messages.init({
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deleted_Messages',
  });
  return Deleted_Messages;
};
