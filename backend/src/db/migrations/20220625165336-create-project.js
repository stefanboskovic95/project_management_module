'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      budget: {
        type: Sequelize.DOUBLE
      },
      totalCost: {
        type: Sequelize.DOUBLE
      },
      confidentiality: {
        type: Sequelize.BOOLEAN
      },
      projectStatusId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'projectstatuses',
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }
};