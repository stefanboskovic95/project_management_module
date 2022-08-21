import { Request, Response } from 'express';
import User from '../db/models/user';
import ProcurementStatus from '../db/models/procurementStatus';
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
    const procurementStatusId = 1; // draft
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
      procurementStatusId,
      projectId,
    });

    
    await project.update({ totalCost: projectTotalCost + cost });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const _updateProjectItemStatus = async (projectItem: ProjectItem, status: string) => {

};

export const updateProjectItem = async (req: Request, res: Response) => {
  try {
    const id = req.body.itemId;
    const name = req.body.name;
    const subject = req.body.subject;
    const updatedItemCost = req.body.cost;
    const isNdaSigned = req.body.isNdaSigned;
    const procurementStatusId = req.body.procurementStatusId;
    const assignee = req.body.assignee;

    const projectItem = await ProjectItem.findOne({ where: { id }});

    const project = await Project.findOne({ where: { id: projectItem['projectId'] } });
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
        procurementStatusId,
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
    const procurementStatusId = req.body.procurementStatusId;
    console.log(`procurementStatusId: ${procurementStatusId}`);
    console.log(`id: ${id}`);

    await ProjectItem.update({ procurementStatusId }, { where: { id } });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
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
      where['procurementStatusId'] = {
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

export const getProcurementStatuses = async (req: Request, res: Response) => {
  try {
    const procurementStatuses = await ProcurementStatus.findAll();
    res.status(200).send(procurementStatuses);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
