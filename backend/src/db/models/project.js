'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    static associate(models) {
    }
  }
  project.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    region: DataTypes.STRING,
    budget: DataTypes.DOUBLE,
    totalCost: DataTypes.DOUBLE,
    confidentiality: DataTypes.BOOLEAN,
    projectStatusId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'project',
  });
  return project;
};