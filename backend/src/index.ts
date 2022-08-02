import express, { Router, Request, Response } from 'express';
import cors from 'cors';

import checkAuth from './middleware/check-auth';
import { login } from './routes/user';
import { getDepartments, getDepartmentOfficials } from './routes/department';
import {
    createProject,
    getProjectStatuses,
    getBusinessCategories,
    getCurrencies,
    getRegions,
    getProjects,
    getProject,
    updateProjectStatus,
    updateProject
} from './routes/project';

const port = process.env.NODE_DOCKER_PORT || 8000

const app = express();
const router = Router();

app.use(express.json());
app.use(cors());

router.route('/test').get(async (_: Request, res: Response) => {
    res.status(200).send({ status: 'ONLINE' })
});

router.route('/login').post(login);
router.route('/project').put(checkAuth, createProject);
router.route('/project').get(checkAuth, getProject);
router.route('/project').patch(checkAuth, updateProject);
router.route('/projects').get(checkAuth, getProjects);
router.route('/project_statuses').get(checkAuth, getProjectStatuses);
router.route('/business_categories').get(checkAuth, getBusinessCategories);
router.route('/departments').get(checkAuth, getDepartments);
router.route('/department_officials').get(checkAuth, getDepartmentOfficials);
router.route('/currencies').get(checkAuth, getCurrencies);
router.route('/regions').get(checkAuth, getRegions);
router.route('/update_project_status').post(checkAuth, updateProjectStatus);

app.use('/', router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
