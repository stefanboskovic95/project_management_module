import { Request, Response } from 'express';
import User from '../db/models/user';
import ProjectItem from '../db/models/projectItem';
import { Op } from 'sequelize';
import Project from '../db/models/project';

const isProjectItemEditable = async (item: ProjectItem, userId: number) => {
  const user = await User.findOne({ where: { id: userId } });
  let isEditable = false;

  // Regular user - item is editable if user is asignee
  if (item['userId'] === userId) {
    isEditable = true;
  }

  // Department Official - Item is editable for project lead
  const project = await Project.findOne({ where: { userId, id: item['projectId'] } });
  if (project) {
    isEditable = true;
  }

  // Department chief can edit any project Item
  if (user['type'] === 'Department Chief') {
    isEditable = true;
  }

  return isEditable;
}

export const getProjectItem = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const id = req.query.itemId;

    let item = await ProjectItem.findOne({ where: { id } });
    const isEditable = await isProjectItemEditable(item, userId);
    item = {
      ...item['dataValues'],
      isEditable
    }
    
    res.status(200).send(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const checkItemNameUnique = async (project: Project, name: string, itemId: number = null) => {
  const projectItems = await ProjectItem.findAll({
    where: { projectId: project['id'], name, [Op.not]: { id: itemId } },
  });
  if (projectItems.length > 0) {
    throw new Error('Project item name must be unique for project.');
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
    const username = req.body.username;

    const user = await User.findOne({ where: { username } });

    const project = await Project.findOne({ where: { id: projectId } });
    const projectBudget = project['budget'];
    const projectTotalCost = project['totalCost'];

    if (project['status'] === 'Completed') {
      return res.status(403).send({ message: 'You cannot add new item to completed project.' });
    }

    await checkItemNameUnique(project, name);

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
      userId: user['id'],
    });

    await project.update({ totalCost: projectTotalCost + cost });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const checkProjectItemStatus = (project: Project, projectItem: ProjectItem, status: string) => {
  if (
    ['In Progress', 'Completed'].includes(status) &&
    !['Accepted', 'Rejected', 'Completed'].includes(project['status'])
  ) {
    throw new Error("Project must be accepted before any item can be moved to 'In Progress' state.");
  }

  if (['In Progress', 'Completed'].includes(status) && !projectItem['userId']) {
    throw new Error('Project Item must have assignee before work on it can start.');
  }

  if (['In Progress', 'Completed'].includes(status) && (projectItem['cost'] == 0 || !projectItem['cost'])) {
    throw new Error('Project Item must have cost before work on it can start.');
  }

  if (['In Progress', 'Completed'].includes(status) && project['isConfidential'] && !projectItem['isNdaSigned']) {
    throw new Error('NDA has to be signed before work on item can start.')
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
    const assigneeUsername = req.body.assignee;

    const projectItem = await ProjectItem.findOne({ where: { id } });
    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });
    const user = await User.findOne({ where: { username: assigneeUsername } });
    const oldItemCost = projectItem['cost'];

    if (projectItem['status'] === 'Completed' && status !== 'Completed' && project['status'] === 'Completed') {
      return res.status(403).send({ message: 'Project is completed.' });
    }

    await checkItemNameUnique(project, name, projectItem['id']);

    projectItem['cost'] = updatedItemCost;
    projectItem['userId'] = user ? user['id'] : undefined;
    projectItem['isNdaSigned'] = isNdaSigned;
    checkProjectItemStatus(project, projectItem, status);

    const projectBudget = project['budget'];
    const projectTotalCost = project['totalCost'];

    let newProjectCost = projectTotalCost - oldItemCost + updatedItemCost;
    if (newProjectCost < 0) {
      newProjectCost = 0;
    }

    if (newProjectCost > projectBudget) {
      return res.status(400).send({ message: 'Project item cost exceeds project budget.' });
    }

    let completedAt = projectItem['completedAt'];
    if (status === 'Completed') {
      completedAt = Date.now();
    }
    else if (projectItem['status'] === 'Completed' && status !== 'Completed') {
      completedAt = null;
    }

    await projectItem.update({
      name,
      subject,
      cost: updatedItemCost,
      userId: user ? user['id'] : null,
      isNdaSigned,
      completedAt,
      status,
    });

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

    const projectItem = await ProjectItem.findOne({ where: { id } });
    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });

    if (projectItem['status'] === 'Completed' && status !== 'Completed' && project['status'] === 'Completed') {
      return res.status(403).send({ message: 'Project is completed.' });
    }

    checkProjectItemStatus(project, projectItem, status);

    let completedAt = projectItem['completedAt'];
    if (status === 'Completed') {
      completedAt = Date.now();
    }
    else if (projectItem['status'] === 'Completed' && status !== 'Completed') {
      completedAt = null;
    }

    await projectItem.update({ status, completedAt });
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

    const items = await ProjectItem.findAll({
      where,
      order,
    });

    const itemsRes = [];
    for (let item of items) {
      const isEditable = await isProjectItemEditable(item, userId);
      itemsRes.push({
        ...item['dataValues'],
        isEditable,
      })
    }

    res.status(200).send(itemsRes);
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

export const deleteProjectItem = async (req: Request, res: Response) => {
  try {
    const id = req.query.itemId;
    const userId = res.locals.userId;

    const user = await User.findOne({ where: { id: userId } });
    const projectItem = await ProjectItem.findOne({ where: { id } });
    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });

    // Department Official cannot delete projectItems of projects that are not assigned to him.
    if ((user['type'] == 'Department Official' && project['userId'] !== userId) || user['type'] == 'Regular') {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    if (user['type'] == 'Regular' && projectItem['userId'] != user['id']) {
      return res.status(403).json({ message: 'You are not authorized to perform this action.' });
    }

    if (['In Progress', 'Completed'].includes(projectItem['status'])) {
      return res.status(400).json({ message: 'You cannot delete project item that is completed or in progress.' });
    }

    await ProjectItem.destroy({ where: { id } });

    const reducedProjectCost = project['totalCost'] - projectItem['cost'];
    await project.update({ totalCost: reducedProjectCost });
    res.status(200).send({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
