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
    type: DataTypes.INTEGER
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  region: DataTypes.STRING,
  budget: DataTypes.DOUBLE,
  total_cost: DataTypes.DOUBLE,
  is_confidential: DataTypes.BOOLEAN,
  project_status_id: DataTypes.INTEGER
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
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(BusinessCategories, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

Project.belongsTo(User, {
  foreignKey: {
    name: 'project_lead'
  },
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