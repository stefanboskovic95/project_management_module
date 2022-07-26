'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import User from './user';

export default class Department extends Model { }

Department.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  full_name: {
    unique: true,
    type: DataTypes.STRING
  },
  abbrev: {
    unique: true,
    type: DataTypes.STRING
  },
}, {
  sequelize: connection,
  modelName: 'department',
  underscored: true
});

Department.belongsTo(User, {
  foreignKey: {
    name: 'department_chief_id'
  },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});