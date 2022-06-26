'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  item.init({
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    description: DataTypes.STRING,
    cost: DataTypes.DOUBLE,
    NDASigned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};