'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

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
    type: DataTypes.ENUM('Regular', 'Department Official', 'Department Chief', 'Admin'),
  },
  {
    sequelize: connection,
    modelName: 'user',
  }
);
