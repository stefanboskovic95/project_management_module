import connection from '../connection/connection';
import Department from '../models/department';
import Nda from '../models/nda';
import Project from '../models/project';
import ProjectItem from '../models/projectItem';
import User from '../models/user';
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

  // ==================== Users ====================
  await User.create({
    id: 1,
    username: 'admin',
    password: '$2b$10$x3OncjXdHLIuXktxYqIIvOM6HF2gFDxBXa3WnubiQvN8AYbgRwezm', // Tranquility78@.'
    firstName: 'Admin',
    lastName: 'Admin',
    type: 'Admin',
  });

  await User.create({
    id: 2,
    username: 'sboskovi',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Stefan',
    lastName: 'Boskovic',
    type: 'Department Chief',
    departmentId: 1,
  });

  await User.create({
    id: 3,
    username: 'mandrije',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Marko',
    lastName: 'Andrijevic',
    type: 'Department Chief',
    departmentId: 2,
  });

  await User.create({
    id: 4,
    username: 'gstancev',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Goran',
    lastName: 'Stancevic',
    type: 'Department Chief',
    departmentId: 3,
  });

  await User.create({
    id: 5,
    username: 'mmatejic',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Mihailo',
    lastName: 'Matejic',
    type: 'Department Official',
    departmentId: 1,
  });

  await User.create({
    id: 6,
    username: 'mstojkov',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Marko',
    lastName: 'Stojkovic',
    type: 'Department Official',
    departmentId: 1,
  });

  await User.create({
    id: 7,
    username: 'avasilje',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Aleksandar',
    lastName: 'Vasiljevic',
    type: 'Regular',
    departmentId: 1,
  });

  await User.create({
    id: 8,
    username: 'urnastic',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Uros',
    lastName: 'Nastic',
    type: 'Department Official',
    departmentId: 1,
  });

  await User.create({
    id: 9,
    username: 'aboljano',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Arsen',
    lastName: 'Boljanovic',
    type: 'Regular',
    departmentId: 1,
  });

  await User.create({
    id: 10,
    username: 'agrubaci',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Aleksa',
    lastName: 'Grubacic',
    type: 'Regular',
    departmentId: 1,
  });

  // Inventory department users.
  await User.create({
    id: 11,
    username: 'gkundaci',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Georgije',
    lastName: 'Kundacina',
    type: 'Department Official',
    departmentId: 2,
  });

  await User.create({
    id: 12,
    username: 'svukovic',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Sanja',
    lastName: 'Vukovic',
    type: 'Regular',
    departmentId: 2,
  });

  // Utilities department users.
  await User.create({
    id: 13,
    username: 'mivanovi',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Marija',
    lastName: 'Ivanovic',
    type: 'Department Official',
    departmentId: 3,
  });

  await User.create({
    id: 14,
    username: 'krokosov',
    password: '$2b$10$yvhaRwQemnuiBs15PB0E3ONgY9t3qZee4JzMySmU0XABvxS0RVzIy', // s123
    firstName: 'Konstantin',
    lastName: 'Rokosovksi',
    type: 'Regular',
    departmentId: 3,
  });


  // Set Department chiefs
  await cpx.update({ userId: 2 });
  await inv.update({ userId: 3 });
  await util.update({ userId: 4 });

  // ==================== Capital Investment Department Projects ====================
  await Project.create({
    id: 1,
    name: 'Izgradnja pristupnih puteva ka mostu na Adi',
    description: 'Izgradnja pristupnih puteva ka mostu na Adi. Put treba da ima dvije trake u oba smjera.',
    budget: 15000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Accepted',
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
    isConfidential: true,
    country: 'Serbia',
    status: 'Accepted',
    userId: 6,
    businessCategory: 'Resource Project',
    departmentId: 1,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 5,
    name: 'Decorative lights for Alhambra',
    description: 'Decorative lights for Alhambra in Grenada.',
    budget: 60000,
    totalCost: 55000,
    isConfidential: false,
    country: 'Spain',
    status: 'Completed',
    userId: 5,
    businessCategory: 'Resource Project',
    departmentId: 1,
    region: 'Western Europe',
  });

  await Project.create({
    id: 6,
    name: 'Wind farm plant in Prague',
    description: 'Wind farm plant in Prague.',
    totalCost: 0,
    isConfidential: false,
    country: 'Czech Republic',
    status: 'Draft',
    businessCategory: 'Development Project',
    departmentId: 1,
    region: 'Central Europe',
  });

  await Project.create({
    id: 7,
    name: 'Marcus Aurelius statue for Antalya Archeology Museum',
    description: 'Marcus Aurelius statue for Antalya Archeology Museum.',
    totalCost: 0,
    isConfidential: true,
    country: 'Turkey',
    status: 'Draft',
    businessCategory: 'Resource Project',
    departmentId: 1,
    region: 'Middle East',
  });

  // ==================== Inventory Department Projects ====================
  await Project.create({
    id: 8,
    name: 'Nabavka 10 vozova tipa Soko',
    description: 'Nabavka 10 brzih vozova tipa Soko',
    budget: 10000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Draft',
    userId: 2,
    businessCategory: 'Resource Project',
    departmentId: 2,
    region: 'Eastern Europe',
  });

  await Project.create({
    id: 9,
    name: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
    description: 'Nabavka 5 miliona kubnih metara prirodnog gasa.',
    budget: 10000000.0,
    totalCost: 0,
    isConfidential: false,
    country: 'Serbia',
    status: 'Draft',
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
    cost: 0,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  await ProjectItem.create({
    id: 2,
    name: 'Proširenje bulevara Patrijarha Pavla u dužini od 2 km',
    subject:
      'Izvršiti konverziju postojećeg puta u put sa 4 trake od sportskog centra Rakovica do ulaza u topčiderski park.',
    cost: 0,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  await ProjectItem.create({
    id: 3,
    name: 'Izgradnja puta kroz topčiderski park do mosta.',
    subject: 'Izgradnja puta kroz topčiderski park do mosta.',
    cost: 0,
    isNdaSigned: false,
    status: 'Draft',
    projectId: 1,
  });

  await ProjectItem.create({
    id: 4,
    name: 'Purchase decorative lightning.',
    subject: 'Purchase decorative lightning.',
    cost: 30000,
    isNdaSigned: true,
    completedAt: Date.now(),
    status: 'Completed',
    userId: 9,
    projectId: 5,
  });

  await ProjectItem.create({
    id: 5,
    name: 'Install decorative lightning.',
    subject: 'Install decorative lightning.',
    cost: 25000,
    isNdaSigned: true,
    completedAt: Date.now(),
    status: 'Completed',
    userId: 9,
    projectId: 5,
  });

  // NDAs
  await Nda.create({
    id: 1,
    text: 'Strogo povjerljivo!',
    projectId: 4,
  });

  await Nda.create({
    id: 2,
    text: 'A little bit classified.',
    projectId: 5,
  });

  await Nda.create({
    id: 3,
    text: 'A little bit classified.',
    projectId: 7,
  });
});
