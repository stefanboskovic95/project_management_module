const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Convention: "Bearer token"
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.SECRET)
    const decoded = jwt.decode(token)
    const username = decoded['username']
    res.locals.isAdmin = isAdmin
    next()
  }
  catch (err) {
    // 401 - not authenticated
    res.status(401).send({ message: "Auth failed" })
  }
  
}