import User from '../db/models/user';

export default async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: res.locals.userId } });
    if (user['type'] !== 'Admin') {
      throw new Error('You do not have permissions to access this API.');
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(403).send({ message: err.message });
  }
};
