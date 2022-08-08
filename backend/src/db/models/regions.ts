'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class Region extends Model {}

Region.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    abbrev: {
      unique: true,
      type: DataTypes.STRING,
    },
    name: DataTypes.STRING,
  },
  {
    sequelize: connection,
    modelName: 'region',
  }
);
