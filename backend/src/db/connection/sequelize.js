const { Sequelize } = require('sequelize')

if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

let sequelize = null
sequelize = new Sequelize(
    process.env.DB,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
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