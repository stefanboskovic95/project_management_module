'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import UserType from './userType';

export default class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    username: {
      unique: true,
      type: DataTypes.STRING,
    },
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'user',
  }
);

User.belongsTo(UserType, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
