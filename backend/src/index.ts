import express, { Router, Request, Response } from 'express';
import cors from 'cors';

import checkAuth from './middleware/check-auth';
import { createUser, getUser, getUsers, getUserTypes, login, updateUser } from './routes/user';
import { getDepartments, getDepartmentOfficials, getDepartmentUsers } from './routes/department';
import {
  createProject,
  getProjectStatuses,
  getBusinessCategories,
  getCurrencies,
  getRegions,
  getProjects,
  getProject,
  updateProjectStatus,
  updateProject,
  deleteProject,
} from './routes/project';
import {
  getProjectItem,
  createProjectItem,
  updateProjectItem,
  updateProjectItemStatus,
  getProjectItems,
  getProjectItemStatuses,
  deleteProjectItem,
} from './routes/items';

const port = process.env.NODE_DOCKER_PORT || 8000;

const app = express();
const router = Router();

app.use(express.json());
app.use(cors());

router.route('/test').get(async (_: Request, res: Response) => {
  res.status(200).send({ status: 'ONLINE' });
});

router.route('/login').post(login);

router.route('/users').get(checkAuth, getUsers);
router.route('/user').get(checkAuth, getUser);
router.route('/user').post(checkAuth, createUser);
router.route('/user').put(checkAuth, updateUser);
router.route('/user/type').get(checkAuth, getUserTypes);

router.route('/project').post(checkAuth, createProject);
router.route('/project').get(checkAuth, getProject);
router.route('/project').put(checkAuth, updateProject);
router.route('/project').delete(checkAuth, deleteProject);
router.route('/projects').get(checkAuth, getProjects);

router.route('/project/item').get(checkAuth, getProjectItem);
router.route('/project/item').post(checkAuth, createProjectItem);
router.route('/project/item').put(checkAuth, updateProjectItem);
router.route('/project/item').delete(checkAuth, deleteProjectItem);
router.route('/project/item').patch(checkAuth, updateProjectItemStatus);
router.route('/project/items').get(checkAuth, getProjectItems);
router.route('/project/items/status').get(checkAuth, getProjectItemStatuses);

router.route('/project/status').get(checkAuth, getProjectStatuses);
router.route('/project/status').patch(checkAuth, updateProjectStatus);
router.route('/project/category').get(checkAuth, getBusinessCategories);
router.route('/project/regions').get(checkAuth, getRegions);

router.route('/department').get(checkAuth, getDepartments);
router.route('/department/users').get(checkAuth, getDepartmentUsers);
router.route('/department/officials').get(checkAuth, getDepartmentOfficials);

router.route('/currencies').get(checkAuth, getCurrencies);

app.use('/', router);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
