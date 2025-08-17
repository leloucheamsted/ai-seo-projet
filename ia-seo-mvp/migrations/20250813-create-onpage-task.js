'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('onpage_tasks', {
            id: { type: Sequelize.STRING, primaryKey: true },
            status_code: Sequelize.INTEGER,
            status_message: Sequelize.STRING,
            time: Sequelize.STRING,
            cost: Sequelize.FLOAT,
            result_count: Sequelize.INTEGER,
            path: Sequelize.JSON,
            data: Sequelize.JSON,
            result: Sequelize.JSON
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('onpage_tasks');
    }
};
