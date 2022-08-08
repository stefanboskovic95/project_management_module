import { Sequelize } from 'sequelize';
import env from './../config/config';
const _env = process.env.NODE_ENV || 'development';
const config = env[_env];

let connection = null;
connection = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  port: config.port,
});

connection
  .authenticate()
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.error('Unable to connect to database', JSON.stringify(err));
  });

export default connection;
