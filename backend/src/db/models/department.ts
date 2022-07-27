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
  fullName: {
    unique: true,
    type: DataTypes.STRING
  },
  abbrev: {
    unique: true,
    type: DataTypes.STRING
  },
}, {
  sequelize: connection,
  modelName: 'department'
});

Department.belongsTo(User, {
  foreignKey: {
    name: 'departmentChiefId'
  },
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});