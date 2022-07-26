import { Request, Response } from 'express';
import ProjectStatus from '../db/models/project_status';
import Project from '../db/models/project';
import BusinessCategories from '../db/models/business_categories';

export const createProject = async (req: Request, res: Response) => {
  try {
    const name: string = req.body.name;
    const description: string = req.body.description;
    // const country: string = req.body.country;
    const region: string = req.body.region;
    const budget: number = req.body.budget;
    const total_cost: number = 0;
    const is_confidential: boolean = req.body.is_confidential;
    const projectStatusId: number = 2; // draft
    const businessCategoryId: number = req.body.business_category_id;
    const userId: number = req.body.project_lead_id;
    const departmentId: number = req.body.department_id;

    const project = await Project.create({
      name,
      description,
      region,
      budget,
      total_cost,
      is_confidential,
      projectStatusId,
      businessCategoryId,
      userId,
      departmentId
    });
    res.status(200).send({message: 'Project created'})
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
    const businessCategories: Array<BusinessCategories> = await BusinessCategories.findAll();
    res.status(200).send(businessCategories);
  }
  catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};