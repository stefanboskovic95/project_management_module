import { Request, Response } from 'express';
import ProjectStatus from '../db/models/projectStatus';
import Project from '../db/models/project';
import BusinessCategory from '../db/models/businessCategories';
import Currency from '../db/models/currency';
import Region from '../db/models/regions';

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
    res.status(200).send({message: 'Project created'})
  }
  catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const departmentId: number = req.query.departmentId;
    const projects: Array<Project> = await Project.findAll({ where: { departmentId }});
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