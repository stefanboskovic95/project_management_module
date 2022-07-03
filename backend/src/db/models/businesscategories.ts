'use strict';

import { Model, DataTypes } from 'sequelize';
import connection from '../connection/connection';


export default class BusinessCategories extends Model { }

BusinessCategories.init({
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  type: DataTypes.STRING
}, {
  sequelize: connection,
  modelName: 'business_categories',
  underscored: true
});