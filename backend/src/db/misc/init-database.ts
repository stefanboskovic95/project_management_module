import connection from '../connection/connection';
import BusinessCategory from '../models/businessCategories';
import Department from '../models/department';
import Nda from '../models/nda';
import ProcurementStatus from '../models/procurementStatus';
import Project from '../models/project';
import ProjectItem from '../models/projectItem';
import ProjectStatus from '../models/projectStatus';
import User from '../models/user';
import UserType from '../models/userType';
import DepartmentUsers from '../models/departmentUsers';
import Region from '../models/regions';
import Currency from '../models/currency';


connection.sync().then(async () => {
    await User.findAll();
    await UserType.findAll();
    await ProjectStatus.findAll();
    await ProjectItem.findAll();
    await Project.findAll();
    await ProcurementStatus.findAll();
    await Nda.findAll();
    await Department.findAll();
    await BusinessCategory.findAll();
    await DepartmentUsers.findAll();

    // ==================== Region ====================
    Region.create({
        id: 1,
        abbrev: 'WE',
        name: 'Western Europe'
    });

    Region.create({
        id: 2,
        abbrev: 'CE',
        name: 'Central Europe'
    });

    Region.create({
        id: 3,
        abbrev: 'EE',
        name: 'Eastern Europe'
    });

    Region.create({
        id: 4,
        abbrev: 'ME',
        name: 'Middle East'
    });

    // ==================== Currency ====================
    Currency.create({
        id: 1,
        name: 'EUR',
        ratioToEur: 1.0
    });

    Currency.create({
        id: 2,
        name: 'USD',
        ratioToEur: 1.01
    });

    Currency.create({
        id: 3,
        name: 'RSD',
        ratioToEur: 0.0085
    });

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
        status: 'dropped'
    });

    await ProjectStatus.create({
        id: 6,
        status: 'completed'
    });


    // ==================== Department ====================
    await Department.create({
        id: 1,
        abbrev: 'CPX',
        fullName: 'Capital Investment Department'
    });

    await Department.create({
        id: 2,
        abbrev: 'INV',
        fullName: 'Inventory Department'
    });

    await Department.create({
        id: 3,
        abbrev: 'UTIL',
        fullName: 'Utilities Department'
    });

    // ==================== ProcurementStatus ====================
    await ProcurementStatus.create({
        id: 1,
        status: 'draft'
    });

    await ProcurementStatus.create({
        id: 2,
        status: 'inProgress'
    });

    await ProcurementStatus.create({
        id: 3,
        status: 'completed'
    });

    // ==================== BusinessCategories ====================
    await BusinessCategory.create({
        id: 1,
        type: 'Investment Project'
    });

    await BusinessCategory.create({
        id: 2,
        type: 'Resource Project'
    });

    await BusinessCategory.create({
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

    await UserType.create({
        id: 4,
        type: 'admin',
    });

    // ==================== Users ====================
    await User.create({
        username: 'admin',
        password: '$2b$10$sMuiKseNOSS5.WJRxLdC1.p85cerpkH0sC/KsnqM0/3xRmJV9tMpW', // admin123
        firstName: 'Admin',
        lastName: 'Admin',
        userTypeId: 4,
        departmentId: 1
    });

    await User.create({
        username: 'sboskovi',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Stefan',
        lastName: 'Boskovic',
        userTypeId: 3,
        departmentId: 1
    });

    await User.create({
        username: 'mandrije',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Marko',
        lastName: 'Andrijevic',
        userTypeId: 3,
        departmentId: 1
    });

    await User.create({
        username: 'gstancev',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Goran',
        lastName: 'Stancevic',
        userTypeId: 3,
        departmentId: 1
    });

    await User.create({
        username: 'mmatejic',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Mihailo',
        lastName: 'Matejic',
        userTypeId: 2,
        departmentId: 1
    });

    await User.create({
        username: 'mstojkov',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Marko',
        lastName: 'Stojkovic',
        userTypeId: 2,
        departmentId: 1
    });

    // ==================== DepartmentUsers ====================
    await DepartmentUsers.create({
        id: 1,
        departmentId: 1,
        userId: 2
    });

    await DepartmentUsers.create({
        id: 2,
        departmentId: 2,
        userId: 3
    });


    await DepartmentUsers.create({
        id: 3,
        departmentId: 3,
        userId: 4
    });


    await DepartmentUsers.create({
        id: 4,
        departmentId: 1,
        userId: 5
    });


    await DepartmentUsers.create({
        id: 5,
        departmentId: 2,
        userId: 6
    });


    // ==================== Projects ====================
    await Project.create({
        name: 'Izgradnja pristupnih puteva ka mostu na Adi',
        description: 'Izgradnja pristupnih puteva ka mostu na Adi. Put treba da ima dvije trake u oba smjera.',
        budget: 15000000.00,
        totalCost: 0,
        isConfidential: false,
        projectStatusId: 1, // Draft
        currencyId: 1,
        userId: 1,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });


    await Project.create({
        name: 'Autoput Čačak - Požega',
        description: 'Izgradnja dionice autoputa između Čačka i Požege.',
        budget: 85000000.00,
        totalCost: 0,
        isConfidential: false,
        projectStatusId: 2, // Deliberation
        currencyId: 1,
        userId: 2,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });

    await Project.create({
        name: 'Alternativni put Foča - Tjentište',
        description: 'Izgradnja alternativnog puta postojecem izmedju Foče i Tjentišta.',
        budget: 45000000.00,
        totalCost: 0,
        isConfidential: false,
        projectStatusId: 2, // Deliberation
        currencyId: 1,
        userId: 2,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });

    await Project.create({
        name: 'Kanalizaciona mreža u centru Zemuna.',
        description: 'Kanalizaciona mreža u centru Zemuna.',
        budget: 8000000.00,
        totalCost: 0,
        isConfidential: false,
        projectStatusId: 3, // Accepted
        currencyId: 1,
        userId: 2,
        businessCategoryId: 2,
        departmentId: 1,
        regionId: 3
    });
});