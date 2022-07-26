import { Request, Response } from 'express';
import User from '../db/models/user';
import Department from '../db/models/department';
import DepartmentUsers from '../db/models/department_users';

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

export const getUsersInDepartment = async (req: Request, res: Response) => {
  try {
    const departmentId = req.query.department_id;
    const departmentUsers: any = await DepartmentUsers.findAll({
      where: {
        departmentId
      },
      include: [User]
    });
    const usernames = await departmentUsers.map((depUser) => depUser.user.username);
    res.status(200).send(usernames);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};