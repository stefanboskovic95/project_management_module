import { Request, Response } from 'express';
import User from '../db/models/user';
import Department from '../db/models/department';
import { Op } from 'sequelize';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments: Array<Department> = await Department.findAll();
    res.status(200).send(departments);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err });
  }
};

export const getProjectLeads = async (userId: number) => {
  const user = await User.findOne({ where: { id: userId } });
  const users = await User.findAll({
    where: { departmentId: user['departmentId'], type: { [Op.or]: ['Department Official', 'Department Chief'] } },
  });
  return users;
};

export const getDepartmentOfficials = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const officials = await getProjectLeads(userId);
    res.status(200).send(officials);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err });
  }
};

const getAllExceptAdmin = async (userId: number) => {
  const user = await User.findOne({ where: { id: userId } });
  const users = await User.findAll({
    where: { departmentId: user['departmentId'], type: { [Op.not]: ['Admin', 'Department Chief'] } },
  });
  return users;
};

export const getDepartmentUsers = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const users = await getAllExceptAdmin(userId);

    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err });
  }
};
