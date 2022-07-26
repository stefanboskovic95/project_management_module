'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import BusinessCategories from './business_categories';
import Department from './department';
import Nda from './nda';
import ProjectItem from './project_item';
import ProjectStatus from './project_status';
import User from './user';

export default class Project extends Model { }

Project.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  region: DataTypes.STRING,
  budget: DataTypes.DOUBLE,
  total_cost: DataTypes.DOUBLE,
  is_confidential: DataTypes.BOOLEAN
}, {
  sequelize: connection,
  modelName: 'project',
  underscored: true
});

Project.hasMany(ProjectItem, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(ProjectStatus, {
  foreignKey: {
    field: 'project_status_id'
  },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(BusinessCategories, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(User, {
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