import { sequelize } from '../config/db.config';
import '../models'; // Import models to register associations

export class DatabaseManager {
    /**
     * Initialize database connection and sync models
     */
    static async initialize(force: boolean = false): Promise<void> {
        try {
            // Test connection
            await sequelize.authenticate();
            console.log('✅ Database connection established successfully.');

            // Sync all models
            await sequelize.sync({ force, alter: !force });
            console.log('✅ Database models synchronized successfully.');

            if (force) {
                console.log('⚠️  Database tables were dropped and recreated.');
            }
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    /**
     * Close database connection
     */
    static async close(): Promise<void> {
        try {
            await sequelize.close();
            console.log('✅ Database connection closed successfully.');
        } catch (error) {
            console.error('❌ Error closing database connection:', error);
            throw error;
        }
    }

    /**
     * Drop all tables (use with caution!)
     */
    static async dropAllTables(): Promise<void> {
        try {
            await sequelize.drop();
            console.log('✅ All tables dropped successfully.');
        } catch (error) {
            console.error('❌ Error dropping tables:', error);
            throw error;
        }
    }

    /**
     * Create database tables without dropping existing ones
     */
    static async createTables(): Promise<void> {
        try {
            await sequelize.sync({ force: false });
            console.log('✅ Database tables created/updated successfully.');
        } catch (error) {
            console.error('❌ Error creating tables:', error);
            throw error;
        }
    }

    /**
     * Check if database connection is healthy
     */
    static async healthCheck(): Promise<boolean> {
        try {
            await sequelize.authenticate();
            return true;
        } catch (error) {
            console.error('❌ Database health check failed:', error);
            return false;
        }
    }

    /**
     * Get database statistics
     */
    static async getStats(): Promise<any> {
        try {
            const [results] = await sequelize.query(`
        SELECT 
          schemaname,
          tablename,
          attname,
          typename,
          char_length
        FROM pg_tables t
        LEFT JOIN pg_attribute a ON a.attrelid = t.tablename::regclass
        LEFT JOIN pg_type y ON y.oid = a.atttypid
        WHERE t.schemaname = 'public'
        AND a.attnum > 0
        AND NOT a.attisdropped
        ORDER BY t.tablename, a.attnum;
      `);

            return results;
        } catch (error) {
            console.error('❌ Error getting database stats:', error);
            return null;
        }
    }
}

// Export for convenience
export { sequelize };
