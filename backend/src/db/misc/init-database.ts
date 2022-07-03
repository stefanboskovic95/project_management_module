import connection from '../connection/connection';
import BusinessCategories from '../models/businesscategories';
import Department from '../models/department';
import DepartmentType from '../models/departmenttype';
import Nda from '../models/nda';
import ProcurementStatus from '../models/procurementstatus';
import Project from '../models/project';
import ProjectItem from '../models/projectitem';
import ProjectStatus from '../models/projectstatus';
import User from '../models/user';
import UserType from '../models/usertype';


connection.sync().then(async () => {
    await User.findAll();
    await UserType.findAll();
    await ProjectStatus.findAll();
    await ProjectItem.findAll();
    await Project.findAll();
    await ProcurementStatus.findAll();
    await Nda.findAll();
    await DepartmentType.findAll();
    await Department.findAll();
    await BusinessCategories.findAll();
})