#!/usr/bin/env ts-node

/**
 * Database migration script for adding user_id to all tables
 * Usage: npm run db:migrate:user-id
 */

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables
dotenv.config();

async function runUserIdMigration() {
    console.log('🚀 Starting user_id migration...');

    let sequelize: Sequelize | null = null;

    try {
        // Initialize Sequelize using environment variables
        sequelize = new Sequelize({
            database: process.env.DB_NAME || 'ia_seo_mvp',
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            dialect: 'postgres',
            logging: console.log,
        });

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Get the migration
        const migration = require('../../migrations/20250821000000-add-user-id-to-all-tables.js');

        console.log('⚡ Running user_id migration...');

        // Run the up migration
        await migration.up(sequelize.getQueryInterface(), Sequelize);

        console.log('✅ User_id migration completed successfully!');
        console.log('📋 Summary: Added user_id columns to all necessary tables with foreign key references to users table');

    } catch (error) {
        console.error('❌ Migration failed:', error);

        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        }

        process.exit(1);
    } finally {
        if (sequelize) {
            await sequelize.close();
            console.log('🔌 Database connection closed.');
        }
    }
}

// Handle process signals
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Exiting...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Exiting...');
    process.exit(0);
});

// Run the migration
runUserIdMigration();
