'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import Currency from './currency';
import Department from './department';
import Nda from './nda';
import ProjectItem from './projectItem';
import Region from './regions';
import User from './user';

export default class Project extends Model {}

Project.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
    },
    description: DataTypes.STRING,
    budget: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    totalCost: DataTypes.DOUBLE,
    isConfidential: DataTypes.BOOLEAN,
    businessCategory: DataTypes.ENUM('Investment Project', 'Resource Project', 'Development Project'),
    status: DataTypes.ENUM('Draft', 'Deliberation', 'Accepted', 'Rejected', 'Completed'),
    country: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'project',
  }
);

Project.hasMany(ProjectItem, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Project.belongsTo(User, {
  // TODO: Why is this causing problems?
  // foreignKey: {
  //   field: 'projectLeadId'
  // },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Department.hasMany(Project, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Project.hasOne(Nda, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Project.belongsTo(Currency, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Project.belongsTo(Region, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

Project.hasOne(Nda, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
