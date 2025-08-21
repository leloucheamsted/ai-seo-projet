'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // List of tables that need user_id column
            const tablesNeedingUserId = [
                'serp_tasks',
                'keywords_for_keywords_tasks',
                'keywords_for_site_tasks',
                'onpage_tasks',
                'domain_rank_overview_tasks',
                'content_analysis_summary_tasks',
                'domain_competitors_tasks',
                'related_keywords_tasks',
                'task_costs'
            ];

            for (const tableName of tablesNeedingUserId) {
                // Check if the table exists and if user_id column already exists
                const tableDescription = await queryInterface.describeTable(tableName);

                if (tableDescription && !tableDescription.user_id) {
                    console.log(`Adding user_id to ${tableName}`);

                    await queryInterface.addColumn(tableName, 'user_id', {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        defaultValue: 1, // Temporary default for existing records
                        references: {
                            model: 'users',
                            key: 'id',
                        },
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    }, { transaction });

                    // Create index for performance
                    await queryInterface.addIndex(tableName, ['user_id'], {
                        name: `${tableName}_user_id_index`,
                        transaction
                    });
                } else if (!tableDescription) {
                    console.log(`Table ${tableName} does not exist, skipping...`);
                } else {
                    console.log(`Table ${tableName} already has user_id column, skipping...`);
                }
            }

            // Add user_id to additional tables from original schema if they exist
            const additionalTables = [
                'url_audits',
                'keyword_searches',
                'rank_monitor',
                'rank_alerts'
            ];

            for (const tableName of additionalTables) {
                try {
                    const tableDescription = await queryInterface.describeTable(tableName);

                    if (tableDescription && !tableDescription.user_id) {
                        console.log(`Adding user_id to ${tableName}`);

                        await queryInterface.addColumn(tableName, 'user_id', {
                            type: Sequelize.INTEGER,
                            allowNull: false,
                            defaultValue: 1, // Temporary default for existing records
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                            onUpdate: 'CASCADE',
                            onDelete: 'CASCADE',
                        }, { transaction });

                        // Create index for performance
                        await queryInterface.addIndex(tableName, ['user_id'], {
                            name: `${tableName}_user_id_index`,
                            transaction
                        });
                    }
                } catch (error) {
                    console.log(`Table ${tableName} does not exist or error occurred: ${error.message}`);
                    // Continue with other tables
                }
            }

            await transaction.commit();
            console.log('Successfully added user_id columns to all necessary tables');

        } catch (error) {
            await transaction.rollback();
            console.error('Error adding user_id columns:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // List of tables to remove user_id from
            const allTables = [
                'serp_tasks',
                'keywords_for_keywords_tasks',
                'keywords_for_site_tasks',
                'onpage_tasks',
                'domain_rank_overview_tasks',
                'content_analysis_summary_tasks',
                'domain_competitors_tasks',
                'related_keywords_tasks',
                'task_costs',
                'url_audits',
                'keyword_searches',
                'rank_monitor',
                'rank_alerts'
            ];

            for (const tableName of allTables) {
                try {
                    const tableDescription = await queryInterface.describeTable(tableName);

                    if (tableDescription && tableDescription.user_id) {
                        console.log(`Removing user_id from ${tableName}`);

                        // Remove index first
                        try {
                            await queryInterface.removeIndex(tableName, `${tableName}_user_id_index`, { transaction });
                        } catch (indexError) {
                            console.log(`Index ${tableName}_user_id_index does not exist or already removed`);
                        }

                        // Remove column
                        await queryInterface.removeColumn(tableName, 'user_id', { transaction });
                    }
                } catch (error) {
                    console.log(`Error processing table ${tableName}: ${error.message}`);
                    // Continue with other tables
                }
            }

            await transaction.commit();
            console.log('Successfully removed user_id columns from all tables');

        } catch (error) {
            await transaction.rollback();
            console.error('Error removing user_id columns:', error);
            throw error;
        }
    }
};
