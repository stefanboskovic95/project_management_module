'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';


export default class DepartmentType extends Model { }

DepartmentType.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  type: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'department_type',
  underscored: true
});