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
}