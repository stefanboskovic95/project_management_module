import { Request, Response } from 'express';
import User from '../db/models/user';
import Department from '../db/models/department';
import DepartmentUsers from '../db/models/departmentUsers';
import UserType from '../db/models/userType';

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

export const getDepartmentOfficials = async (req: Request, res: Response) => {
  try {
    const departmentId = req.query.departmentId;
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
    console.log(officials)
    res.status(200).send(officials);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};