'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_costs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      task_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      task_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      api_endpoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add index for better query performance
    await queryInterface.addIndex('task_costs', ['user_id']);
    await queryInterface.addIndex('task_costs', ['task_id']);
    await queryInterface.addIndex('task_costs', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_costs');
  }
};
