import connection from '../connection/connection';
import BusinessCategories from '../models/business_categories';
import Department from '../models/department';
import Nda from '../models/nda';
import ProcurementStatus from '../models/procurement_status';
import Project from '../models/project';
import ProjectItem from '../models/project_item';
import ProjectStatus from '../models/project_status';
import User from '../models/user';
import UserType from '../models/user_type';
import DepartmentUsers from '../models/department_users';


connection.sync().then(async () => {
    await User.findAll();
    await UserType.findAll();
    await ProjectStatus.findAll();
    await ProjectItem.findAll();
    await Project.findAll();
    await ProcurementStatus.findAll();
    await Nda.findAll();
    await Department.findAll();
    await BusinessCategories.findAll();
    await DepartmentUsers.findAll();

    // ========== ProjectStatus ==========
    await ProjectStatus.create({
        id: 1,
        status: 'draft'
    });

    await ProjectStatus.create({
        id: 2,
        status: 'deliberation'
    });

    await ProjectStatus.create({
        id: 3,
        status: 'accepted'
    });

    await ProjectStatus.create({
        id: 4,
        status: 'rejected'
    });

    await ProjectStatus.create({
        id: 5,
        status: 'completed'
    });


    // ========== Department ==========
    await Department.create({
        id: 1,
        abbrev: 'CPX',
        full_name: 'Capital Investment Department'
    });

    await Department.create({
        id: 2,
        abbrev: 'INV',
        full_name: 'Inventory Department'
    });

    await Department.create({
        id: 3,
        abbrev: 'UTIL',
        full_name: 'Utilities Department'
    });

    // ========== ProcurementStatus ==========
    await ProcurementStatus.create({
        id: 1,
        status: 'draft'
    });

    await ProcurementStatus.create({
        id: 2,
        status: 'in_progress'
    });

    await ProcurementStatus.create({
        id: 3,
        status: 'completed'
    });
})