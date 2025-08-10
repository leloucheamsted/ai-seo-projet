// Simple logger implementation for development
// Will be replaced with winston when dependencies are installed

export interface LogContext {
    [key: string]: any;
}

class SimpleLogger {
    private logLevel: string = process.env.LOG_LEVEL || 'info';

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private shouldLog(level: string): boolean {
        const levels = ['error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }

    private formatMessage(level: string, message: string, context?: LogContext): string {
        const timestamp = this.getTimestamp();
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }

    error(message: string, context?: LogContext): void {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, context));
        }
    }

    warn(message: string, context?: LogContext): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, context));
        }
    }

    info(message: string, context?: LogContext): void {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', message, context));
        }
    }

    debug(message: string, context?: LogContext): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', message, context));
        }
    }

    http(message: string, context?: LogContext): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('http', message, context));
        }
    }
}

export const logger = new SimpleLogger();

// Utility functions
export const logError = (error: Error, context?: string): void => {
    logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
        stack: error.stack,
        name: error.name,
    });
};

export const logInfo = (message: string, meta?: any): void => {
    logger.info(message, meta);
};

export const logWarn = (message: string, meta?: any): void => {
    logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any): void => {
    logger.debug(message, meta);
};

// API request logger
export const logApiRequest = (
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: number
): void => {
    logger.info('API Request', {
        method,
        url,
        statusCode,
        responseTime: `${responseTime}ms`,
        userId: userId || 'anonymous',
    });
};

// DataForSEO API logger
export const logDataForSEORequest = (
    endpoint: string,
    requestData: any,
    responseData: any,
    duration: number
): void => {
    logger.info('DataForSEO API Request', {
        endpoint,
        requestSize: JSON.stringify(requestData).length,
        responseSize: JSON.stringify(responseData).length,
        duration: `${duration}ms`,
    });
};

// Error logger with context
export const logWithContext = (
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    context: Record<string, any>
): void => {
    logger[level](message, context);
};