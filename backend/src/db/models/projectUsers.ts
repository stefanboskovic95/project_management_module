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
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

ProjectUsers.belongsTo(User, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});
