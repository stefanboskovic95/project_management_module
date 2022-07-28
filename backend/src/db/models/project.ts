'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import BusinessCategory from './businessCategories';
import Currency from './currency';
import Department from './department';
import Nda from './nda';
import ProjectItem from './projectItem';
import ProjectStatus from './projectStatus';
import Region from './regions';
import User from './user';

export default class Project extends Model { }

Project.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: {
    unique: true,
    type: DataTypes.STRING
  },
  description: DataTypes.STRING,
  budget: DataTypes.DOUBLE,
  totalCost: DataTypes.DOUBLE,
  isConfidential: DataTypes.BOOLEAN
}, {
  sequelize: connection,
  modelName: 'project'
});

Project.hasMany(ProjectItem, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(ProjectStatus, {
  foreignKey: {
    field: 'projectStatusId'
  },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(BusinessCategory, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(User, {
  // TODO: Why is this causing problems?
  // foreignKey: {
  //   field: 'projectLeadId'
  // },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Department.hasMany(Project, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.hasOne(Nda, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(Currency, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(Region, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
})