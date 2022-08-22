'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';
import User from './user';

export default class ProjectItem extends Model {}

ProjectItem.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      unique: 'project_item'
    },
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    cost: DataTypes.DOUBLE,
    status: DataTypes.ENUM('Draft', 'In Progress', 'Completed'),
    isNdaSigned: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection,
    modelName: 'item',
  }
);

ProjectItem.belongsTo(User, {
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
