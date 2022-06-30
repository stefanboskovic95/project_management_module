const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + './../config/config.js')[env];

let sequelize = null
sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
        port: config.port
    }
)

sequelize.
    authenticate()
    .then(() => {
        console.log("Connected to database!")
    })
    .catch((err) => {
        console.error("Unable to connect to database", JSON.stringify(err))
    })

module.exports = sequelize