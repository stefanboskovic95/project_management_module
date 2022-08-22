import connection from '../connection/connection';
import Department from '../models/department';
import Nda from '../models/nda';
import Project from '../models/project';
import ProjectItem from '../models/projectItem';
import User from '../models/user';
import UserType from '../models/userType';
import Currency from '../models/currency';
import ProjectUsers from '../models/projectUsers';

connection.sync().then(async () => {
  // ==================== Currency ====================
  Currency.create({
    id: 1,
    name: 'EUR',
    ratioToEur: 1.0,
  });

  Currency.create({
    id: 2,
    name: 'USD',
    ratioToEur: 1.01,
  });

  Currency.create({
    id: 3,
    name: 'RSD',
    ratioToEur: 0.0085,
  });
  // ==================== Department ====================
  const cpx = await Department.create({
    id: 1,
    abbrev: 'CPX',
    fullName: 'Capital Investment Department',
  });

  const inv = await Department.create({
    id: 2,
    abbrev: 'INV',
    fullName: 'Inventory Department',
  });

  const util = await Department.create({
    id: 3,
    abbrev: 'UTIL',
    fullName: 'Utilities Department',
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
    id: 1,
    username: 'admin',
    password: '$2b$10$sMuiKseNOSS5.WJRxLdC1.p85cerpkH0sC/KsnqM0/3xRmJV9tMpW', // admin123
    firstName: 'Admin',
    lastName: 'Admin',
    userTypeId: 4,
  });

  await User.create({
    id: 2,
    username: 'sboskovi',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Stefan',
    lastName: 'Boskovic',
    userTypeId: 3,
    departmentId: 1,
  });

  await User.create({
    id: 3,
    username: 'mandrije',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Marko',
    lastName: 'Andrijevic',
    userTypeId: 3,
    departmentId: 2,
  });

  await User.create({
    id: 4,
    username: 'gstancev',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Goran',
    lastName: 'Stancevic',
    userTypeId: 3,
    departmentId: 3,
  });

  await User.create({
    id: 5,
    username: 'mmatejic',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Mihailo',
    lastName: 'Matejic',
    userTypeId: 2,
    departmentId: 1,
  });

  await User.create({
    id: 6,
    username: 'mstojkov',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Marko',
    lastName: 'Stojkovic',
    userTypeId: 2,
    departmentId: 1,
  });

  await User.create({
    id: 7,
    username: 'avasilje',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Aleksandar',
    lastName: 'Vasiljevic',
    userTypeId: 1,
    departmentId: 1,
  });

  await User.create({
    id: 8,
    username: 'urnastic',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Uros',
    lastName: 'Nastic',
    userTypeId: 2,
    departmentId: 1,
  });

  await User.create({
    id: 9,
    username: 'aboljano',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Arsen',
    lastName: 'Boljanovic',
    userTypeId: 1,
    departmentId: 1,
  });

  await User.create({
    id: 10,
    username: 'agrubaci',
    password: '$2b$10$74nFonWbMdJxuHO0J1WPWeDbMd/8RWPnJJNWgfo/F1C/sSEdlLAiS', // s123
    firstName: 'Aleksa',
    lastName: 'Grubacic',
    userTypeId: 1,
    departmentId: 1,
  });

  // Set Department chiefs
  await cpx.update({ userId: 2 });
  await inv.update({ userId: 3 });
  await util.update({ userId: 4 });

  // ==================== Projects ====================
  await Project.create({
    id: 1,
    name: 'Izgradnja pristupnih puteva ka mostu na Adi',
    description: 'Izgradnja pristupnih puteva ka mostu na Adi. Put treba da ima dvije trake u oba smjera.',
    budget: 15000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Accepted',
    currencyId: 1,
    userId: 5,
    businessCategory: 'Investment Project',
    departmentId: 1,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 2,
    name: 'Autoput Čačak - Požega',
    description: 'Izgradnja dionice autoputa između Čačka i Požege.',
    budget: 85000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Deliberation',
    currencyId: 1,
    userId: 2,
    businessCategory: 'Investment Project',
    departmentId: 1,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 3,
    name: 'Alternativni put Foča - Tjentište',
    description: 'Izgradnja alternativnog puta postojecem izmedju Foče i Tjentišta.',
    budget: 45000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Deliberation',
    currencyId: 1,
    userId: 2,
    businessCategory: 'Investment Project',
    departmentId: 1,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 4,
    name: 'Kanalizaciona mreža u centru Zemuna.',
    description: 'Kanalizaciona mreža u centru Zemuna.',
    budget: 8000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Accepted',
    currencyId: 1,
    userId: 2,
    businessCategory: 'Resource Project',
    departmentId: 1,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 5,
    name: 'Nabavka 10 vozova tipa Soko',
    description: 'Nabavka 10 brzih vozova tipa Soko',
    budget: 10000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Draft',
    currencyId: 1,
    userId: 2,
    businessCategory: 'Resource Project',
    departmentId: 2,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 6,
    name: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
    description: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
    budget: 10000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Draft',
    currencyId: 1,
    userId: 2,
    businessCategory: 'Resource Project',
    departmentId: 2,
    region: 'Eastern Europe',
  });

  // ==================== ProjectItems ====================
  await ProjectItem.create({
    id: 1,
    name: 'Prilagodjavanje kanalizacione mreze',
    subject: 'Prilagoditi kanalizacionu mrezu na trasi buduceg puta',
    cost: 1000000,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  await ProjectItem.create({
    id: 2,
    name: 'Proširenje bulevara Patrijarha Pavla u dužini od 2 km',
    subject:
      'Izvršiti konverziju postojećeg puta u put sa 4 trake od sportskog centra Rakovica do ulaza u topčiderski park.',
    cost: 5000000,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  await ProjectItem.create({
    id: 3,
    name: 'Izgradnja puta kroz topčiderski park do mosta.',
    subject: 'Izgradnja puta kroz topčiderski park do mosta.',
    cost: 8500000,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  // ==================== ProjectUsers ====================
  await ProjectUsers.create({
    id: 1,
    projectId: 5,
    userId: 9,
  });

  await ProjectUsers.create({
    id: 2,
    projectId: 5,
    userId: 10,
  });

  await ProjectUsers.create({
    id: 3,
    projectId: 6,
    userId: 10,
  });
});
