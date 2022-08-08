'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class Currency extends Model {}

Currency.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    name: DataTypes.STRING,
    ratioToEur: DataTypes.DOUBLE,
  },
  {
    sequelize: connection,
    modelName: 'currency',
  }
);
