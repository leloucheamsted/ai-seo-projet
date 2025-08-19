'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('content_analysis_summary_tasks', 'params', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('content_analysis_summary_tasks', 'isReady', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    await queryInterface.addColumn('content_analysis_summary_tasks', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('content_analysis_summary_tasks', 'params');
    await queryInterface.removeColumn('content_analysis_summary_tasks', 'isReady');
    await queryInterface.removeColumn('content_analysis_summary_tasks', 'created_at');
  }
};
