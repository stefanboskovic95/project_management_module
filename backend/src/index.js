const express = require('express')
const { Sequelize } = require('sequelize');
const connection = require('./db/connection/sequelize');
const port = process.env.NODE_DOCKER_PORT || 8000

const app = express();
const router = express.Router();

router.route('/test').get(async (req, res) => {
    res.status(200).send({ status: 'ONLINE' })
});

router.route('/test_orm').get(async (req, res) => {
    try {
        const User = require('./db/models/user')(connection, Sequelize.DataTypes);
        User.create({
            username: 'sboskovi',
            password: 's123',
            name: 'Stefan',
            lastName: 'Boskovic'
        });
        res.status(200).send({ message: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
});

app.use('/', router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
