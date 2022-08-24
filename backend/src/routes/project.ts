import { Request, Response } from 'express';
import { Op, fn, col } from 'sequelize';
import Project from '../db/models/project';
import Currency from '../db/models/currency';
import ProjectUsers from '../db/models/projectUsers';
import User from '../db/models/user';
import Nda from '../db/models/nda';
import ProjectItem from '../db/models/projectItem';

export const createProject = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: res.locals.userId }});
    const userType = user['type'];
    if (userType === 'Regular') {
      return res.status(403).send({ message: 'You are not authorized to preform this action.' });
    }

    const name: string = req.body.name;
    const description: string = req.body.description;
    const country: string = req.body.country;
    const budget: number = req.body.budget;
    const totalCost: number = 0;
    const isConfidential: boolean = req.body.isConfidential;
    const status: string = 'Draft';
    const businessCategory: string = req.body.businessCategory;
    const region: string = req.body.region;
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
      region,
      currencyId,
      status,
      businessCategory,
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

const checkProjectStatus = async (project: Project, status: string, userType: string) => {
  // Regular user cannot update projects
  if (userType == 'Regular') {
    throw new Error('You are not authorized to preform this action.');
  }

  // Only department chief can approve or reject the project. High official can update other states.
  if (userType == 'Department Official' && !['Accepted', 'Rejected'].includes(status)) {
    throw new Error('Only Department Chief can accept or reject the project.');
  }

  // When project is accepted it cannot be sent back to draft / deliberation
  if (['Accepted', 'Rejected', 'Completed'].includes(project['status']) && ['Draft', 'Deliberation'].includes(status)) {
    throw new Error('When project is accepted it cannot be sent back to draft / deliberation');
  }

  // Project budget must be set before project is sent to deliberation
  if (
    ['Deliberation', 'Accepted', 'Rejected', 'Completed'].includes(status) &&
    (project['budget'] == 0 || !project['budget'])
  ) {
    throw new Error('Project budget must be set before project is sent to deliberation');
  }

  // Project lead must be set before project is sent to deliberation
  if (['Deliberation', 'Accepted', 'Rejected', 'Completed'].includes(status) && !project['userId']) {
    throw new Error('Project lead must be set before project is sent to deliberation');
  }

  const nonCompletedProjectItems = await ProjectItem.findAll({
    where: { projectId: project['id'], [Op.not]: { status: 'Completed' } },
  });
  if (status == 'Completed' && nonCompletedProjectItems.length > 0) {
    throw new Error('All project items must be in completed state before project can be completed.');
  }

  // const totalProjectCost = await ProjectItem.findAll({
  //   attributes: [ [fn('sum', col('cost')), 'total_cost'] ],
  //   where: { projectId: project['id'] },
  //   raw: true
  // });

  if (project['totalCost'] > project['budget']) {
    throw new Error('Project budget must not ne lower then project cost.');
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: res.locals.userId }});
    const userType = user['type'];
    if (userType === 'Regular') {
      return res.status(403).json({ message: 'You are not authorized to preform this action.' });
    }

    const projectId = req.body.projectId;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const country: string = req.body.country;
    const budget: number = req.body.budget | 0;
    const isConfidential: boolean = req.body.isConfidential;
    const status: string = req.body.status;
    const businessCategory: string = req.body.businessCategory;
    const region: string = req.body.region;
    const projectLeadId: number = req.body.projectLeadId;
    const departmentId: number = req.body.departmentId;
    const currencyId: number = req.body.currencyId;
    const ndaText: string = req.body.nda;

    const existingProject = await Project.findOne({ where: { id: projectId } });

    existingProject['userId'] = projectLeadId;
    existingProject['budget'] = budget;
    await checkProjectStatus(existingProject, status, userType);

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
        businessCategory,
        status,
        region,
        userId: projectLeadId,
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
    const status: string = req.body.status;
    const userId: number = res.locals.userId;
    const user = await User.findOne({ where: { id: userId } });

    const project: Project = await Project.findOne({
      where: { id: projectId },
    });

    await checkProjectStatus(project, status, user['type']);

    await project.update({ status });

    res.status(200).json({ message: 'Updated!' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const user = await User.findOne({ where: { id: userId } });
    const userType = user['type'];
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
      where['status'] = {
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
      where['region'] = {
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
    if (userType == 'Regular') {
      // Project user belongs to
      const projectUsers: Array<ProjectUsers> = await ProjectUsers.findAll({
        where: { userId },
      });
      const projectIds = projectUsers.map((item) => item['projectId']);
      where['id'] = {
        [Op.or]: projectIds,
      };
    }
    // Department Official
    if (userType == 'Department Official') {
      where['departmentId'] = departmentId;
      where['isConfidential'] = false;
    }
    // Department chief
    if (userType == 'Department Chief') {
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
    const user = await User.findOne({ where: { id: userId } });
    const userType = user['type'];
    const where = { id: projectId };
    let isEditable = true;

    // Regular user
    if (userType == 'Regular') {
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

    // Department Official cannot edit projects on which he is not a project lead
    if (userType == 'Department Official' && project['userId'] != userId) {
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
    const projectStatuses: any = Project.getAttributes().status.values;
    res.status(200).send(projectStatuses);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};

export const getBusinessCategories = async (req: Request, res: Response) => {
  try {
    const businessCategories: any = Project.getAttributes().businessCategory.values;
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
    const regions: any = Project.getAttributes().region.values;
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

    const user = await User.findOne({ where: { id: userId } });
    const project = await Project.findOne({ where: { id: projectId } });

    const departmentId: number = user['departmentId'];
    const projectUserId = project['userId'];

    if (departmentId !== project['departmentId']) {
      return res.status(403).json({ message: 'You do not have access to this project.' });
    }

    // Department chief can delete any project in his department.
    // Department Official can only delete his projects.
    // Regular user cannot delete project.
    if (user['userType'] == 'Department Official' && projectUserId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    if (user['userType'] == 'Regular') {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    // Project must not be in accepted state.
    if (project['status'] == 'Accepted') {
      return res.status(400).json({ message: 'You cannot delete project in progress.' });
    }

    // There must not be any ProjectItems inProgress state.
    const items = await ProjectItem.findAll({ where: { projectId, status: 'In Progress' } });
    if (items.length > 0) {
      return res.status(400).json({ message: 'You cannot delete a project that has any project item in progress.' });
    }

    await Project.destroy({ where: { id: projectId } });
    res.status(200).json({ message: `Project ${project['name']} deleted!` });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
};
