'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import UserType from './user_type';

export default class User extends Model { };

User.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  username: {
    unique: true,
    type: DataTypes.STRING
  },
  password: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'user',
  underscored: true
});

User.belongsTo(UserType, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});