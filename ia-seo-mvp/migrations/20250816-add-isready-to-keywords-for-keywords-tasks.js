'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'keywords_for_keywords_tasks',
            'isReady',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('keywords_for_keywords_tasks', 'isReady');
    }
};
