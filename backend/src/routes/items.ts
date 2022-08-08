import { Request, Response } from 'express';
import ProcurementStatus from '../db/models/procurementStatus';
import ProjectItem from '../db/models/projectItem';

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

    await ProjectItem.create({
      name,
      subject,
      cost,
      isNdaSigned,
      procurementStatusId,
      projectId,
    });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const updateProjectItem = async (req: Request, res: Response) => {
  try {
    const id = req.body.itemId;
    const name = req.body.name;
    const subject = req.body.subject;
    const cost = req.body.cost;
    const isNdaSigned = req.body.isNdaSigned;
    const procurementStatusId = req.body.procurementStatusId;

    await ProjectItem.update(
      {
        name,
        subject,
        cost,
        isNdaSigned,
        procurementStatusId,
      },
      { where: { id } }
    );
    res.status(200).json({ message: 'ok' });
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
    const projectId = req.query.projectId;
    const items = await ProjectItem.findAll({ where: { projectId } });
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
