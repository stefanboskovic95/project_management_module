'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import Department from './department';
import Nda from './nda';
import ProjectItem from './projectItem';
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
    region: DataTypes.ENUM('Western Europe', 'Central Europe', 'Eastern Europe', 'Middle East'),
    country: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'project',
  }
);

Project.hasMany(ProjectItem, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Project.belongsTo(User, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Department.hasMany(Project, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Project.hasOne(Nda, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});
