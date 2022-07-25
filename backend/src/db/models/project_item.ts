'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import ProcurementStatus from './procurement_status';

export default class ProjectItem extends Model { }

ProjectItem.init({
  name: DataTypes.STRING,
  subject: DataTypes.STRING,
  description: DataTypes.STRING,
  cost: DataTypes.DOUBLE,
  nda_signed: DataTypes.BOOLEAN
}, {
  sequelize: connection,
  modelName: 'item',
  underscored: true
});

ProjectItem.belongsTo(ProcurementStatus, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL'
});

// ProcurementStatus.hasMany(ProjectItem, {
//   onUpdate: 'SET NULL',
//   onDelete: 'SET NULL'
// });