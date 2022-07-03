'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

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