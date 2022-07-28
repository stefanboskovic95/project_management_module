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
    updateProjectStatus
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
router.route('/create_project', checkAuth).post(createProject);
router.route('/project_statuses', checkAuth).get(getProjectStatuses);
router.route('/business_categories', checkAuth).get(getBusinessCategories);
router.route('/departments', checkAuth).get(getDepartments);
router.route('/department_officials', checkAuth).get(getDepartmentOfficials);
router.route('/currencies', checkAuth).get(getCurrencies);
router.route('/regions', checkAuth).get(getRegions);
router.route('/projects', checkAuth).get(getProjects);
router.route('/update_project_status', checkAuth).post(updateProjectStatus);

app.use('/', router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
