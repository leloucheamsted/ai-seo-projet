'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('onpage_tasks', 'params', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {}
    });

    await queryInterface.addColumn('onpage_tasks', 'isReady', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('onpage_tasks', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('onpage_tasks', 'params');
    await queryInterface.removeColumn('onpage_tasks', 'isReady');
    await queryInterface.removeColumn('onpage_tasks', 'created_at');
  }
};
