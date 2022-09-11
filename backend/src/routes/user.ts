import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../db/models/user';
import { Op } from 'sequelize';
import Department from '../db/models/department';

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
      departmentId: user['departmentId'],
      token: token,
      expiresIn: 3600,
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Login error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const where = { type: { [Op.not]: 'Admin' } };

    // Finding
    const findWhat = req.query.find;
    if (findWhat) {
      where['username'] = { [Op.like]: `%${findWhat}%` };
    }

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where,
    });
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    const foundUser = await User.findOne({
      attributes: { exclude: ['password'] },
      where: { id },
    });

    res.status(200).send(foundUser);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

const updateDepartmentChief = async (type, departmentId) => {
  // If user is upgraded to Department Chief.
  if (type == 'Department Chief') {
    const department = await Department.findOne({ where: { id: departmentId } });
    // Update type of previous department chief.
    await User.update(
      {
        type: 'Department Official',
      },
      { where: { id: department['userId'] } }
    );
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const type = req.body.type;
    const departmentId = req.body.departmentId;

    if (type === 'Admin') {
      return res.status(403).send({ message: 'Creating admin accounts is prohibited!' });
    }

    const hash = await bcrypt.hash(password, process.env.SALT);

    const user = await User.create({
      username,
      password: hash,
      firstName,
      lastName,
      type,
      departmentId,
    });

    await updateDepartmentChief(type, departmentId);

    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const type = req.body.type;
    const departmentId = req.body.departmentId;

    let updateWhat: any = {
      username,
      firstName,
      lastName,
      type,
      departmentId,
    };
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateWhat = { ...updateWhat, password: hash };
    }

    const user = await User.update(
      {
        ...updateWhat,
      },
      { where: { id } }
    );

    await updateDepartmentChief(type, departmentId);

    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

export const getUserTypes = async (req: Request, res: Response) => {
  try {
    const userTypes = User.getAttributes().type.values;
    res.status(200).send(userTypes);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    const user = await User.findOne({ where: { id } });
    if (user['type'] === 'Admin') {
      return res.status(403).send({ message: 'Deleting admin accounts is prohibited!' });
    }

    await User.destroy({ where: { id } });
    res.status(200).send({ message: 'User deleted.' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};
