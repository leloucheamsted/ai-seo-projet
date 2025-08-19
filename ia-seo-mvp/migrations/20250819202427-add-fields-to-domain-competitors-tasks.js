'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('domain_competitors_tasks', 'params', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('domain_competitors_tasks', 'isReady', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    await queryInterface.addColumn('domain_competitors_tasks', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('domain_competitors_tasks', 'params');
    await queryInterface.removeColumn('domain_competitors_tasks', 'isReady');
    await queryInterface.removeColumn('domain_competitors_tasks', 'created_at');
  }
};
