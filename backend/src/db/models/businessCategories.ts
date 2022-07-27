'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';


export default class BusinessCategory extends Model { }

BusinessCategory.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  type: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'business_categories'
});