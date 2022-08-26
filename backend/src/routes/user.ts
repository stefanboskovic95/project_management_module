import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../db/models/user';
import { Op } from 'sequelize';

export const login = async (req: Request, res: Response) => {
  try {
    const user: User = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user['password']);

    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user['id'] }, process.env.SECRET, { expiresIn: '1h' });

    res.status(200).json({
      username: user['username'],
      firstName: user['firstName'],
      lastName: user['lastName'],
      type: user['type'],
      token: token,
      expiresIn: 3600,
    });
  } catch (err) {
    console.log('Login error');
    console.log(err);
    res.status(400).send({ message: 'Login error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const where = { type: { [Op.not]: 'Admin' } }
    
    // Finding
    const findWhat = req.query.find;
    console.log(findWhat)
    if (findWhat) {
      where['username'] = { [Op.like]: `%${findWhat}%` };
    }
    
    const users = await User.findAll({ where });
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
}
