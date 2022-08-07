import { Request, Response } from 'express';
import ProjectItem from '../db/models/projectItem';

export const getProjectItems = async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId;
    const items = await ProjectItem.findAll({ where: { projectId } });
    res.status(200).send(items);
  }
  catch (err) {
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
      projectId
    })

    res.status(200).json({ message: 'ok' })
  }
  catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};