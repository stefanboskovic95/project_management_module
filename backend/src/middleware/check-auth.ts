import { verify, decode } from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    // Convention: "Bearer token"
    const token = req.headers.authorization.split(' ')[1];
    verify(token, process.env.SECRET);
    const decoded = decode(token);
    const id = decoded['id'];
    const userTypeId = decoded['userTypeId'];
    res.locals.userId = id;
    res.locals.userTypeId = userTypeId;
    next();
  } catch (err) {
    // 401 - not authenticated
    res.status(401).send({ message: 'Auth failed' });
  }
};
