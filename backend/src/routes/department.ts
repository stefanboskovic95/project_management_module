import { Request, Response } from 'express';
import User from '../db/models/user';
import Department from '../db/models/department';
import DepartmentUsers from '../db/models/departmentUsers';

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments: Array<Department> = await Department.findAll();
    res.status(200).send(departments);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getProjectLeads = async (userId: number) => {
  const departmentUser = await DepartmentUsers.findOne({ where: {userId }});
  const departmentId = departmentUser['departmentId']
  const departmentUsers: any = await DepartmentUsers.findAll({
    where: {
      departmentId
    },
    include: [User]
  });
  const officials = await departmentUsers.filter(depUser => [2, 3].includes(depUser.user.userTypeId)).map((depUser) => ({
    id: depUser.user.id,
    username: depUser.user.username,
    firstName: depUser.user.firstName,
    lastName: depUser.user.lastName
  }));
  return officials;
}

export const getDepartmentOfficials = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const officials = await getProjectLeads(userId);
    res.status(200).send(officials);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};