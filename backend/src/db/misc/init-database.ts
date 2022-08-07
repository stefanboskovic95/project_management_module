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
import ProjectUsers from '../models/projectUsers';


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
        status: 'rejected' // rejected / dropped
    });

    await ProjectStatus.create({
        id: 5,
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
    // Department 1
    await User.create({
        id: 1,
        username: 'admin',
        password: '$2b$10$sMuiKseNOSS5.WJRxLdC1.p85cerpkH0sC/KsnqM0/3xRmJV9tMpW', // admin123
        firstName: 'Admin',
        lastName: 'Admin',
        userTypeId: 4
    });

    await User.create({
        id: 2,
        username: 'sboskovi',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Stefan',
        lastName: 'Boskovic',
        userTypeId: 3
    });

    await User.create({
        id: 3,
        username: 'mandrije',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Marko',
        lastName: 'Andrijevic',
        userTypeId: 3
    });

    await User.create({
        id: 4,
        username: 'gstancev',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Goran',
        lastName: 'Stancevic',
        userTypeId: 3
    });

    await User.create({
        id: 5,
        username: 'mmatejic',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Mihailo',
        lastName: 'Matejic',
        userTypeId: 2
    });

    await User.create({
        id: 6,
        username: 'mstojkov',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Marko',
        lastName: 'Stojkovic',
        userTypeId: 2
    });

    // Department 2
    await User.create({
        id: 7,
        username: 'avasilje',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Aleksandar',
        lastName: 'Vasiljevic',
        userTypeId: 3
    });

    await User.create({
        id: 8,
        username: 'urnastic',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Uros',
        lastName: 'Nastic',
        userTypeId: 2
    });

    await User.create({
        id: 9,
        username: 'aboljano',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Arsen',
        lastName: 'Boljanovic',
        userTypeId: 1
    });


    await User.create({
        id: 10,
        username: 'agrubaci',
        password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
        firstName: 'Aleksa',
        lastName: 'Grubacic',
        userTypeId: 1
    });


    // ==================== DepartmentUsers ====================
    await DepartmentUsers.create({
        id: 1,
        departmentId: 1,
        userId: 1
    });

    await DepartmentUsers.create({
        id: 2,
        departmentId: 1,
        userId: 2
    });

    await DepartmentUsers.create({
        id: 3,
        departmentId: 2,
        userId: 3
    });


    await DepartmentUsers.create({
        id: 4,
        departmentId: 3,
        userId: 4
    });


    await DepartmentUsers.create({
        id: 5,
        departmentId: 1,
        userId: 5
    });


    await DepartmentUsers.create({
        id: 6,
        departmentId: 2,
        userId: 6
    });

    await DepartmentUsers.create({
        id: 7,
        departmentId: 2,
        userId: 7
    });

    await DepartmentUsers.create({
        id: 8,
        departmentId: 2,
        userId: 8
    });

    await DepartmentUsers.create({
        id: 9,
        departmentId: 2,
        userId: 9
    });

    await DepartmentUsers.create({
        id: 10,
        departmentId: 2,
        userId: 10
    });


    // ==================== Projects ====================
    await Project.create({
        id: 1,
        name: 'Izgradnja pristupnih puteva ka mostu na Adi',
        description: 'Izgradnja pristupnih puteva ka mostu na Adi. Put treba da ima dvije trake u oba smjera.',
        budget: 15000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 1, // Draft
        currencyId: 1,
        userId: 5,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });


    await Project.create({
        id: 2,
        name: 'Autoput Čačak - Požega',
        description: 'Izgradnja dionice autoputa između Čačka i Požege.',
        budget: 85000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 2, // Deliberation
        currencyId: 1,
        userId: 2,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });

    await Project.create({
        id: 3,
        name: 'Alternativni put Foča - Tjentište',
        description: 'Izgradnja alternativnog puta postojecem izmedju Foče i Tjentišta.',
        budget: 45000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 2, // Deliberation
        currencyId: 1,
        userId: 2,
        businessCategoryId: 1,
        departmentId: 1,
        regionId: 3
    });

    await Project.create({
        id: 4,
        name: 'Kanalizaciona mreža u centru Zemuna.',
        description: 'Kanalizaciona mreža u centru Zemuna.',
        budget: 8000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 3, // Accepted
        currencyId: 1,
        userId: 2,
        businessCategoryId: 2,
        departmentId: 1,
        regionId: 3
    });

    await Project.create({
        id: 5,
        name: 'Nabavka 10 vozova tipa Soko',
        description: 'Nabavka 10 brzih vozova tipa Soko',
        budget: 10000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 1, // Draft
        currencyId: 1,
        userId: 2,
        businessCategoryId: 2,
        departmentId: 2,
        regionId: 3
    });

    await Project.create({
        id: 6,
        name: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
        description: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
        budget: 10000000.00,
        totalCost: 0,
        isConfidential: false,
        country: 'Serbia',
        projectStatusId: 1, // Draft
        currencyId: 1,
        userId: 2,
        businessCategoryId: 2,
        departmentId: 2,
        regionId: 3
    });

    // ==================== ProjectItems ====================
    await ProjectItem.create({
        id: 1,
        name: 'Prilagodjavanje kanalizacione mreze',
        subject: 'Prilagoditi kanalizacionu mrezu na trasi buduceg puta',
        cost: 1000000,
        isNdaSigned: false,
        procurementStatusId: 3,
        projectId: 1
    });

    await ProjectItem.create({
        id: 2,
        name: 'Proširenje bulevara Patrijarha Pavla u dužini od 2 km',
        subject: 'Izvršiti konverziju postojećeg puta u put sa 4 trake od sportskog centra Rakovica do ulaza u topčiderski park.',
        cost: 5000000,
        isNdaSigned: false,
        procurementStatusId: 2,
        projectId: 1
    });

    await ProjectItem.create({
        id: 3,
        name: 'Izgradnja puta kroz topčiderski park do mosta.',
        subject: 'Izgradnja puta kroz topčiderski park do mosta.',
        cost: 8500000,
        isNdaSigned: false,
        procurementStatusId: 1,
        projectId: 1
    });

    // ==================== ProjectUsers ====================
    await ProjectUsers.create({
        id: 1,
        projectId: 5,
        userId: 9
    });

    await ProjectUsers.create({
        id: 2,
        projectId: 5,
        userId: 10
    });

    await ProjectUsers.create({
        id: 3,
        projectId: 6,
        userId: 10
    });
});