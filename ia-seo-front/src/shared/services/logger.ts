

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
    context?: string;
    extra?: Record<string, any>;
}

function formatMessage(level: LogLevel, message: string, options?: LogOptions) {
    const ctx = options?.context ? `[${options.context}] ` : '';
    const extra = options?.extra ? JSON.stringify(options.extra) : '';
    return `${new Date().toISOString()} ${level.toUpperCase()} ${ctx}${message} ${extra}`;
}

export const logger = {
    info: (message: string, options?: LogOptions) => {
        // eslint-disable-next-line no-console
        console.info(formatMessage('info', message, options));
    },
    warn: (message: string, options?: LogOptions) => {
        // eslint-disable-next-line no-console
        console.warn(formatMessage('warn', message, options));
    },
    error: (message: string, options?: LogOptions) => {
        // eslint-disable-next-line no-console
        console.error(formatMessage('error', message, options));
    },
    debug: (message: string, options?: LogOptions) => {
        // eslint-disable-next-line no-console
        console.debug(formatMessage('debug', message, options));
    },
};
