'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class Department extends Model { }

Department.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'department',
  underscored: true
});