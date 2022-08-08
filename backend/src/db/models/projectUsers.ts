'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import Project from './project';
import User from './user';

export default class ProjectUsers extends Model {}

ProjectUsers.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: connection,
    modelName: 'project_user',
  }
);

ProjectUsers.belongsTo(Project, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

ProjectUsers.belongsTo(User, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
