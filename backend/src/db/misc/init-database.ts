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

    // ==================== ProjectStatus ====================
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


    // ==================== Department ====================
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

    // ==================== ProcurementStatus ====================
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

    // ==================== BusinessCategories ====================
    await BusinessCategories.create({
        id: 1,
        type: 'Investment Project'
    });

    await BusinessCategories.create({
        id: 2,
        type: 'Resource Project'
    });

    await BusinessCategories.create({
        id: 3,
        type: 'Development Project'
    });

    
    // ==================== UserType ====================
    await UserType.create({
        id: 1,
        type: 'regular',
    });

    await UserType.create({
        id: 2,
        type: 'Department High Official',
    });

    await UserType.create({
        id: 3,
        type: 'Department Chief',
    });

    // ==================== Users ====================
    await User.create({
        id: 1,
        username: 'sboskovi',
        password: '',
        first_name: 'Stefan',
        last_name: 'Boskovic',
        userTypeId: 3
    });

    await User.create({
        id: 2,
        username: 'mandrije',
        password: '',
        first_name: 'Marko',
        last_name: 'Andrijevic',
        userTypeId: 3
    });

    await User.create({
        id: 3,
        username: 'gstancev',
        password: '',
        first_name: 'Goran',
        last_name: 'Stancevic',
        userTypeId: 3
    });

    await User.create({
        id: 4,
        username: 'mmatejic',
        password: '',
        first_name: 'Mihailo',
        last_name: 'Matejic',
        userTypeId: 2
    });

    await User.create({
        id: 5,
        username: 'mstojkov',
        password: '',
        first_name: 'Marko',
        last_name: 'Stojkovic',
        userTypeId: 2
    });

    // ==================== DepartmentUsers ====================
    await DepartmentUsers.create({
        id: 1,
        departmentId: 1,
        userId: 1
    });

    await DepartmentUsers.create({
        id: 2,
        departmentId: 2,
        userId: 2
    });


    await DepartmentUsers.create({
        id: 3,
        departmentId: 3,
        userId: 3
    });


    await DepartmentUsers.create({
        id: 4,
        departmentId: 1,
        userId: 4
    });


    await DepartmentUsers.create({
        id: 5,
        departmentId: 2,
        userId: 5
    });

});