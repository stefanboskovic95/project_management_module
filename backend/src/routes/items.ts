import { Request, Response } from 'express';
import User from '../db/models/user';
import ProjectItem from '../db/models/projectItem';
import { Op } from 'sequelize';
import Project from '../db/models/project';

export const getProjectItem = async (req: Request, res: Response) => {
  try {
    const id = req.query.itemId;
    const item = await ProjectItem.findOne({ where: { id } });
    res.status(200).send(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const createProjectItem = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const subject = req.body.subject;
    const cost = req.body.cost;
    const isNdaSigned = req.body.isNdaSigned;
    const status = 'Draft';
    const projectId = req.body.projectId;

    const project = await Project.findOne({ where: { id: projectId } });
    const projectBudget = project['budget'];
    const projectTotalCost = project['totalCost'];
  
    if (projectTotalCost + cost > projectBudget) {
      return res.status(400).send({ message: 'Project item cost exceeds project budget.' });
    }

    await ProjectItem.create({
      name,
      subject,
      cost,
      isNdaSigned,
      status,
      projectId,
    });

    
    await project.update({ totalCost: projectTotalCost + cost });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const checkProjectItemStatus = (project: Project, projectItem: ProjectItem, status: string) => {
  if (['In Progress', 'Completed'].includes(status) && !['Accepted', 'Rejected', 'Completed'].includes(project['status'])) {
    throw new Error('Project must be accepted before any item can be moved to \'In Progress\' state.');
  }

  if (['In Progress', 'Completed'].includes(status) && !projectItem['userId']) {
    throw new Error('Project Item must have assignee before work on it can start.')
  }

  if (['In Progress', 'Completed'].includes(status) && (projectItem['cost'] == 0 || !projectItem['cost'])) {
    throw new Error('Project Item must have cost before work on it can start.')
  }
};

export const updateProjectItem = async (req: Request, res: Response) => {
  try {
    const id = req.body.itemId;
    const name = req.body.name;
    const subject = req.body.subject;
    const updatedItemCost = req.body.cost;
    const isNdaSigned = req.body.isNdaSigned;
    const status = req.body.status;
    const assignee = req.body.assignee;

    const projectItem = await ProjectItem.findOne({ where: { id }});
    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });

    projectItem['cost'] = updatedItemCost;
    projectItem['userId'] = assignee;
    checkProjectItemStatus(project, projectItem, status);

    const projectBudget = project['budget'];
    const projectTotalCost = project['totalCost'];
    
    const oldItemCost = projectItem['cost'];
    const newProjectCost = projectTotalCost - oldItemCost + updatedItemCost;
    console.log(`newProjectCost: ${newProjectCost}`)

    if (newProjectCost > projectBudget) {
      return res.status(400).send({ message: 'Project item cost exceeds project budget.' });
    }

    const user = await User.findOne({ where: { username: assignee } });

    await projectItem.update(
      {
        name,
        subject,
        cost: updatedItemCost,
        userId: user ? user['id'] : null,
        isNdaSigned,
        status,
      }
    );

    await project.update({ totalCost: newProjectCost });

    res.status(200).json({ message: 'ok', projectItem });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const updateProjectItemStatus = async (req: Request, res: Response) => {
  try {
    const id = req.body.itemId;
    const status = req.body.status;

    const projectItem = await ProjectItem.findOne({ where: { id }});
    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });

    checkProjectItemStatus(project, projectItem, status);

    projectItem.update({ status });
    res.status(200).json({ message: 'ok' });
  } catch (err) {
    // console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getProjectItems = async (req: Request, res: Response) => {
  try {
    const userId: number = res.locals.userId;
    const projectId = req.query.projectId;
    const orderBy: string = req.query.orderBy;
    const ascending: string = req.query.ascending;

    // Sorting
    let order = [];
    if (orderBy && ascending) {
      order = [[orderBy, ascending === 'true' ? 'ASC' : 'DESC']];
    } else {
      order = [['id', 'DESC']];
    }

    let where = { projectId };

    // Filtering
    if (req.query.myItems) {
      where['userId'] = userId;
    }
    if (req.query.isConfidential) {
      where['isNdaSigned'] = true;
    }
    // Item statuses
    const statuses = req.query.status;
    if (statuses) {
      where['status'] = {
        [Op.or]: Array.isArray(statuses) ? statuses : [statuses],
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
    console.log(where);

    const items = await ProjectItem.findAll({
      where,
      order,
    });
    res.status(200).send(items);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const getProjectItemStatuses = async (req: Request, res: Response) => {
  try {
    const projectItemStatuses = ProjectItem.getAttributes().status.values;
    res.status(200).send(projectItemStatuses);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
