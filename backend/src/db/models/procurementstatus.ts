'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';

export default class ProcurementStatus extends Model { }

ProcurementStatus.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  type: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'procurement_status',
  underscored: true
});