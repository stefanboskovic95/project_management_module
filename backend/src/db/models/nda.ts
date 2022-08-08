'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class Nda extends Model {}

Nda.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    text: DataTypes.TEXT,
  },
  {
    sequelize: connection,
    modelName: 'nda',
  }
);
