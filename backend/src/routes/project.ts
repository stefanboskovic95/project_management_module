import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProjectStatus from '../db/models/projectStatus';
import Project from '../db/models/project';
import BusinessCategory from '../db/models/businessCategories';
import Currency from '../db/models/currency';
import Region from '../db/models/regions';
import ProjectUsers from '../db/models/projectUsers';
import User from '../db/models/user';
import Nda from '../db/models/nda';
import { getProjectLeads } from './department';
import ProjectItem from '../db/models/projectItem';

export const createProject = async (req: Request, res: Response) => {
  try {
    if (res.locals.userTypeId == 1) {
      return res.status(403).send({ message: 'You are not authorized to preform this action.' });
    }

    const name: string = req.body.name;
    const description: string = req.body.description;
    const country: string = req.body.country;
    const budget: number = req.body.budget;
    const totalCost: number = 0;
    const isConfidential: boolean = req.body.isConfidential;
    const projectStatusId: number = 1; // draft
    const businessCategoryId: number = req.body.businessCategoryId;
    const regionId: string = req.body.regionId;
    const userId: number = req.body.projectLeadId;
    const departmentId: number = req.body.departmentId;
    const currencyId: number = req.body.currencyId | 1;
    const ndaText: string = req.body.nda;

    const project = await Project.create({
      name,
      description,
      budget,
      totalCost,
      isConfidential,
      country,
      regionId,
      currencyId,
      projectStatusId,
      businessCategoryId,
      userId: userId ? userId : null,
      departmentId,
    });

    if (isConfidential) {
      await Nda.create({
        text: ndaText,
        projectId: project['id'],
      });
    }

    res.status(200).send({ message: 'Project created' });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

const _updateProjectStatus = async (projectId, projectStatusId, userTypeId) => {
  // Regular user cannot update projects
  if (userTypeId == 1) {
    throw new Error('You are not authorized to preform this action.');
  }

  const project: Project = await Project.findOne({
    where: { id: projectId },
  });

  // Only department chief can approve or reject the project. High official can update other states.
  if (userTypeId == 2 && ![3, 4].includes(projectStatusId)) {
    throw new Error('Only Department Chief can accept or reject the project.');
  }

  // When project is accepted it cannot be sent back to draft / deliberation
  if ([3, 4, 5].includes(project['projectStatusId']) && [1, 2].includes(projectStatusId)) {
    throw new Error('When project is accepted it cannot be sent back to draft / deliberation');
  }

  // Project budget must be set before project is sent to deliberation
  console.log(`projectStatusId: ${projectStatusId}`)
  if (projectStatusId >= 2 && project['budget'] == 0) {
    throw new Error('Project budget must be set before project is sent to deliberation');
  }

  // Project lead must be set before project is sent to deliberation
  if (projectStatusId >= 2 && !project['userId']) {
    throw new Error('Project lead must be set before project is sent to deliberation');
  }

  await Project.update({ projectStatusId }, { where: { id: projectId } });
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const userTypeId: number = res.locals.userTypeId;
    if (userTypeId == 1) {
      return res.status(403).json({ message: 'You are not authorized to preform this action.' });
    }

    console.log(req.body);

    const projectId = req.body.projectId;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const country: string = req.body.country;
    const budget: number = req.body.budget;
    const isConfidential: boolean = req.body.isConfidential;
    const projectStatusId: number = req.body.statusId;
    const businessCategoryId: number = req.body.businessCategoryId;
    const regionId: string = req.body.regionId;
    const userId: number = req.body.projectLeadId;
    const departmentId: number = req.body.departmentId;
    const currencyId: number = req.body.currencyId;
    const ndaText: string = req.body.nda;

    const existingProject = await Project.findOne({ where: { id: projectId } });

    
    await _updateProjectStatus(projectId, projectStatusId, userTypeId);

    if (isConfidential && !existingProject['isConfidential']) {
      Nda.create({
        text: ndaText,
        projectId,
      });
    } else if (!isConfidential && existingProject['isConfidential']) {
      Nda.destroy({ where: { projectId } });
    } else if (isConfidential && existingProject['isConfidential']) {
      Nda.update({ text: ndaText }, { where: { projectId } });
    }

    await Project.update(
      {
        name,
        description,
        country,
        budget,
        isConfidential,
        businessCategoryId,
        regionId,
        userId,
        departmentId,
        currencyId,
      },
      { where: { id: projectId } }
    );
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    const projectId: number = req.body.projectId;
    const projectStatusId: number = req.body.projectStatusId;
    const userTypeId: number = res.locals.userTypeId;

    await _updateProjectStatus(projectId, projectStatusId, userTypeId);

    res.status(200).json({ message: 'Updated!' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const userTypeId: number = res.locals.userTypeId;

    const user = await User.findOne({ where: { id: userId } });
    const departmentId: number = Number(user['departmentId']);
    const orderBy: string = req.query.orderBy;
    const ascending: string = req.query.ascending;
    // Sorting
    let order = [];
    if (orderBy && ascending) {
      order = [[orderBy, ascending === 'true' ? 'ASC' : 'DESC']];
    } else {
      order = [['id', 'DESC']];
    }

    // Filtering
    let where = {};
    if (req.query.isConfidential) {
      where['isConfidential'] = true;
    }
    if (req.query.myProjects) {
      where['userId'] = userId;
    }
    // Budget size
    const filterOptions = {
      small: { [Op.lt]: 50000 },
      medium: { [Op.between]: [50000, 1000000] },
      large: { [Op.gt]: 1000000 },
    };
    const sizes = Object.keys(req.query).filter((item) => Object.keys(filterOptions).includes(item));
    if (sizes.length > 0 && sizes.length < 3) {
      const operators = [];
      sizes.forEach((size) => {
        operators.push(filterOptions[size]);
      });

      where['budget'] = { [Op.or]: operators };
    }
    // Project statuses
    const statuses = req.query.status;
    if (statuses) {
      where['projectStatusId'] = {
        [Op.or]: Array.isArray(statuses) ? statuses : [statuses],
      };
    }
    // Project leads
    const users = req.query.user;
    if (users) {
      const userIds = Array.isArray(users) ? users : [users];
      if (where['userId']) {
        where['userId'] = { [Op.or]: [...userIds, where['userId']] };
      } else {
        where['userId'] = { [Op.or]: userIds };
      }
    }
    // Countries
    const countries = req.query.country;
    if (countries) {
      where['country'] = {
        [Op.or]: Array.isArray(countries) ? countries : [countries],
      };
    }
    // Regions
    const regions = req.query.region;
    if (regions) {
      where['regionId'] = {
        [Op.or]: Array.isArray(regions) ? regions : [regions],
      };
    }
    // Finding
    const findWhat = req.query.find;
    if (findWhat) {
      const potentialId = Number(findWhat);
      if (Number.isInteger(potentialId)) {
        where['id'] = potentialId;
      } else {
        where['name'] = { [Op.like]: `%${findWhat}%` };
      }
    }

    // Regular user
    if (userTypeId == 1) {
      // Project user belongs to
      const projectUsers: Array<ProjectUsers> = await ProjectUsers.findAll({
        where: { userId },
      });
      const projectIds = projectUsers.map((item) => item['projectId']);
      where['id'] = {
        [Op.or]: projectIds,
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

    const projects: Array<Project> = await Project.findAll({
      where,
      order,
    });
    res.status(200).send(projects);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const projectId: number = req.query.projectId;
    const userId: number = res.locals.userId;
    const userTypeId: number = res.locals.userTypeId;
    const where = { id: projectId };
    let isEditable = true;

    // Regular user
    if (userTypeId == 1) {
      // Project user belongs to
      const projectUsers: ProjectUsers = await ProjectUsers.findOne({
        where: { projectId, userId },
      });
      if (!projectUsers) {
        return res.status(403).send({ message: 'You do not have access to this project' });
      }
      isEditable = false;
    }

    console.log(where);
    const project: Project = await Project.findOne({ where, include: [Nda] });

    // Department High official cannot edit projects on which he is not a project lead
    if (userTypeId == 2 && project['userId'] != userId) {
      isEditable = false;
    }

    // let nda = {};
    // if (project['isConfidential']) {
    //   nda = await Nda.findOne({ where: { projectId: project['id'] } });
    // }

    const result = {
      ...project['dataValues'],
      // ...nda['dataValues'],
      isEditable: isEditable,
    };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getProjectStatuses = async (req: Request, res: Response) => {
  try {
    const projectStatuses: Array<ProjectStatus> = await ProjectStatus.findAll();
    res.status(200).send(projectStatuses);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getBusinessCategories = async (req: Request, res: Response) => {
  try {
    const businessCategories: Array<BusinessCategory> = await BusinessCategory.findAll();
    res.status(200).send(businessCategories);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies: Array<Currency> = await Currency.findAll();
    res.status(200).send(currencies);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getRegions = async (req: Request, res: Response) => {
  try {
    const regions: Array<Region> = await Region.findAll();
    res.status(200).send(regions);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId;
    const userId = res.locals.userId;
    console.log(projectId)
    
    const user = await User.findOne({ where: { id: userId } });
    const project = await Project.findOne({ where: { id: projectId } });
    const departmentId: number = user['departmentId'];

    console.log(`departmentId: ${departmentId}`)
    console.log(`project['departmentId']: ${project['departmentId']}`)
    if (departmentId !== project['departmentId']) {
      return res.status(403).json({ message: 'You do not have access to this project.' });
    }

    // Department chief can delete any project in his department.
    // Department high official can only delete his projects.
    // Regular user cannot delete project.
    if ((user['userTypeId'] == 2 && project['userId'] !== userId) || user['userTypeId'] == 1) {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' })
    }

    // Project must not be in accepted state.
    if (project['projectStatusId'] == 3) {
      return res.status(403).json({ message: 'You cannot delete project in progress.'});
    }

    // There must not be any ProjectItems inProgress state.
    const items = await ProjectItem.findAll({ where: { projectId, procurementStatusId: 2 } });
    if (items.length > 0) {
      return res.status(403).json({ message: 'You cannot delete a project that has any project item in progress.' })
    }
    
    await Project.destroy({ where: { id: projectId } });
    res.status(200).json({ message: `Project ${project['name']} deleted!` });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};
