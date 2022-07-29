import { Request, Response } from 'express';
import ProjectStatus from '../db/models/projectStatus';
import Project from '../db/models/project';
import BusinessCategory from '../db/models/businessCategories';
import Currency from '../db/models/currency';
import Region from '../db/models/regions';
import DepartmentUsers from '../db/models/departmentUsers';
import ProjectUsers from '../db/models/projectUsers';
import { Op } from "sequelize";

export const createProject = async (req: Request, res: Response) => {
  try {
    const name: string = req.body.name;
    const description: string = req.body.description;
    // const country: string = req.body.country;
    const budget: number = req.body.budget;
    const totalCost: number = 0;
    const isConfidential: boolean = req.body.isConfidential;
    const projectStatusId: number = 1; // draft
    const businessCategoryId: number = req.body.businessCategoryId;
    const regionId: string = req.body.regionId;
    const userId: number = req.body.projectLeadId;
    const departmentId: number = req.body.departmentId;
    const currencyId: number = req.body.currencyId;

    const project = await Project.create({
      name,
      description,
      budget,
      totalCost,
      isConfidential,
      regionId,
      currencyId,
      projectStatusId,
      businessCategoryId,
      userId,
      departmentId
    });
    res.status(200).send({ message: 'Project created' })
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    const projectId: number = req.body.projectId;
    const projectStatusId: number = req.body.projectStatusId;
    const userTypeId: number = res.locals.userTypeId;

    // Regular user cannot update projects
    if (userTypeId == 1) {
      return res.status(403).send({message: 'You are not authorized to preform this action.'})
    }
    
    const project: Project = await Project.findOne({ where: { id: projectId } });

    // Only department chief can approve or reject the project. High official can update other states.
    if (userTypeId == 2 && ![3, 4].includes(projectStatusId)) {
      return res.status(403).send({message: 'Only Department Chief can accept or reject the project.'})
    }

    await Project.update(
      { projectStatusId },
      { where: { id: projectId } }
    );
    res.status(200).send({ message: 'Updated!' });
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const userTypeId: number = res.locals.userTypeId;

    const departmentUser: DepartmentUsers = await DepartmentUsers.findOne({ where: { userId } });
    const departmentId: number = departmentUser['departmentId'];
    const where = {};

    // Regular user
    if (userTypeId == 1) {
      // Project user belongs to
      const projectUsers: Array<ProjectUsers> = await ProjectUsers.findAll({ where: { userId } });
      const projectIds = projectUsers.map(item => item['projectId']);
      where['id'] = {
        [Op.or]: projectIds
      };
    }
    // Department High official
    if (userTypeId == 2) {
      where['departmentId'] = departmentId;
      where['isConfidential'] = false;
    }
    // Department chief
    if (userTypeId == 3) {
      where['departmentId'] = departmentId;
    }

    const projects: Array<Project> = await Project.findAll({ where });
    res.status(200).send(projects);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getProjectStatuses = async (req: Request, res: Response) => {
  try {
    const projectStatuses: Array<ProjectStatus> = await ProjectStatus.findAll();
    res.status(200).send(projectStatuses);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getBusinessCategories = async (req: Request, res: Response) => {
  try {
    const businessCategories: Array<BusinessCategory> = await BusinessCategory.findAll();
    res.status(200).send(businessCategories);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies: Array<Currency> = await Currency.findAll();
    res.status(200).send(currencies);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getRegions = async (req: Request, res: Response) => {
  try {
    const regions: Array<Region> = await Region.findAll();
    res.status(200).send(regions);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};