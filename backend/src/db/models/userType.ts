'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class UserType extends Model {}

UserType.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    type: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'user_type',
  }
);
