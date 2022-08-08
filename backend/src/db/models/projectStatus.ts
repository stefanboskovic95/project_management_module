'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class ProjectStatus extends Model {}

ProjectStatus.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    status: {
      unique: true,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: connection,
    modelName: 'project_status',
  }
);
