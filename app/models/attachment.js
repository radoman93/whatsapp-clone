'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attachment.belongsTo(models.Message, {
        foreignKey:'messageId',
        as:'attachment'
      })

    }
  }
  Attachment.init({
    messageId: DataTypes.INTEGER,
    thumbUrl: DataTypes.TEXT,
    fileUrl: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};
