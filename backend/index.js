const express = require('express')
const dotenv = require('dotenv')
const port = process.env.NODE_DOCKER_PORT || 8080

const app = express()
const router = express.Router()

router.route('/test').get(async (req, res) => {
    res.status(200).send({status: 'ONLINE'})
})

app.use('/', router)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
