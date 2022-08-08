'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import Department from './department';
import User from './user';

export default class DepartmentUsers extends Model {}

DepartmentUsers.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: connection,
    modelName: 'department_users',
  }
);

DepartmentUsers.belongsTo(Department, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});

DepartmentUsers.belongsTo(User, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
