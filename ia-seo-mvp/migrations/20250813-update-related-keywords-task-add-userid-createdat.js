'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('related_keywords_tasks', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });
    await queryInterface.addColumn('related_keywords_tasks', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('related_keywords_tasks', 'user_id');
    await queryInterface.removeColumn('related_keywords_tasks', 'created_at');
  }
};
