#!/usr/bin/env ts-node

/**
 * Database initialization script
 * Usage: npm run db:init
 */

import dotenv from 'dotenv';
import { DatabaseManager } from '../config/database.manager';

// Load environment variables
dotenv.config();

async function initDatabase() {
    console.log('🚀 Starting database initialization...');

    try {
        // Parse command line arguments
        const args = process.argv.slice(2);
        const force = args.includes('--force') || args.includes('-f');
        const drop = args.includes('--drop');

        if (drop) {
            console.log('⚠️  Dropping all tables...');
            await DatabaseManager.dropAllTables();
        }

        // Initialize database
        await DatabaseManager.initialize(force);

        // Check health
        const isHealthy = await DatabaseManager.healthCheck();
        if (isHealthy) {
            console.log('✅ Database is healthy and ready!');
        } else {
            console.log('❌ Database health check failed!');
        }

        // Show stats
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Database Statistics:');
            const stats = await DatabaseManager.getStats();
            if (stats && stats.length > 0) {
                console.table(stats.slice(0, 10)); // Show first 10 rows
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Handle process signals
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Closing database connection...');
    await DatabaseManager.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Closing database connection...');
    await DatabaseManager.close();
    process.exit(0);
});

// Run the initialization
initDatabase();
