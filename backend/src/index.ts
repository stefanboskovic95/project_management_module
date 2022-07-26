import express, { Router, Request, Response } from 'express';
import User from './db/models/user';
import { createProject, getProjectStatuses, getBusinessCategories } from './routes/project';
import { getDepartments, getUsersInDepartment } from './routes/department';
const port = process.env.NODE_DOCKER_PORT || 8000

const app = express();
const router = Router();

app.use(express.json());

router.route('/test').get(async (req: Request, res: Response) => {
    res.status(200).send({ status: 'ONLINE' })
});

router.route('/create_project').post(createProject);
router.route('/project_statuses').get(getProjectStatuses);
router.route('/business_categories').get(getBusinessCategories);
router.route('/departments').get(getDepartments);
router.route('/users_in_department').get(getUsersInDepartment);

app.use('/', router);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
