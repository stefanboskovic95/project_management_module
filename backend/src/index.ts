import express, { Router, Request, Response } from 'express';
import { createProject, getProjectStatuses, getBusinessCategories, getCurrencies, getRegions, getProjects } from './routes/project';
import { getDepartments, getDepartmentOfficials} from './routes/department';
import cors from 'cors';
const port = process.env.NODE_DOCKER_PORT || 8000

const app = express();
const router = Router();

app.use(express.json());
app.use(cors());

router.route('/test').get(async (req: Request, res: Response) => {
    res.status(200).send({ status: 'ONLINE' })
});

router.route('/create_project').post(createProject);
router.route('/project_statuses').get(getProjectStatuses);
router.route('/business_categories').get(getBusinessCategories);
router.route('/departments').get(getDepartments);
router.route('/department_officials').get(getDepartmentOfficials);
router.route('/currencies').get(getCurrencies);
router.route('/regions').get(getRegions);
router.route('/projects').get(getProjects);

app.use('/', router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
