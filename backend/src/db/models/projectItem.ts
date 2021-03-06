'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import ProcurementStatus from './procurementStatus';

export default class ProjectItem extends Model { }

ProjectItem.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: DataTypes.STRING,
  subject: DataTypes.STRING,
  description: DataTypes.STRING,
  cost: DataTypes.DOUBLE,
  isNdaSigned: DataTypes.BOOLEAN
}, {
  sequelize: connection,
  modelName: 'item'
});

ProjectItem.belongsTo(ProcurementStatus, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});