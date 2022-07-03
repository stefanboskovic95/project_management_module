'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class User extends Model { };

User.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'user',
  underscored: true
});
