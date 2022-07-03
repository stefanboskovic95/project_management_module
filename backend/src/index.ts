import express, { Router } from 'express';
import User from './db/models/user';
const port = process.env.NODE_DOCKER_PORT || 8000

const app = express();
const router = Router();

router.route('/test').get(async (req, res) => {
    res.status(200).send({ status: 'ONLINE' })
});

router.route('/test_orm').get(async (req, res) => {
    try {
        User.create({
            username: 'sboskovi',
            password: 's123',
            first_name: 'Stefan',
            last_name: 'Boskovic'
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
