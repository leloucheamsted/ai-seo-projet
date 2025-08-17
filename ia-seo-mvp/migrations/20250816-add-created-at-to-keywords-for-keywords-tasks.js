'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'keywords_for_keywords_tasks',
            'created_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('keywords_for_keywords_tasks', 'created_at');
    }
};
