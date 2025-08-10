import App from './app';
import { DatabaseManager } from './config/database.manager';
import { logger } from './utils/logger';

/**
 * Start the server
 */
async function startServer(): Promise<void> {
    try {
        // Initialize database
        logger.info('🔌 Initializing database connection...');
        await DatabaseManager.initialize();

        // Create and start app
        const app = new App();
        app.listen();

        // Graceful shutdown handlers
        setupGracefulShutdown(app);

        logger.info('🎉 Server startup completed successfully');
    } catch (error) {
        logger.error('❌ Failed to start server', { error });
        process.exit(1);
    }
}

/**
 * Setup graceful shutdown handlers
 */
function setupGracefulShutdown(app: App): void {
    const gracefulShutdown = async (signal: string) => {
        logger.info(`📨 Received ${signal}. Starting graceful shutdown...`);

        try {
            // Close database connections
            await DatabaseManager.close();

            // Shutdown app
            app.shutdown();

            logger.info('✅ Graceful shutdown completed');
            process.exit(0);
        } catch (error) {
            logger.error('❌ Error during graceful shutdown', { error });
            process.exit(1);
        }
    };

    // Handle different termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
        logger.error('💥 Uncaught Exception', { error: error.message, stack: error.stack });
        process.exit(1);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        logger.error('💥 Unhandled Rejection', { reason, promise });
        process.exit(1);
    });
}

// Start the server
startServer();