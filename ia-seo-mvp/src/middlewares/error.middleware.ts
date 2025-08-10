import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export class AppError extends Error implements CustomError {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    logger.error('Error caught by middleware', {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.userId,
    });

    // Joi validation error
    if (err.name === 'ValidationError' && 'details' in err) {
        const validationError = err as ValidationError;
        const message = validationError.details.map(detail => detail.message).join(', ');
        error = new AppError(message, 400);
    }

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const message = 'Validation error';
        error = new AppError(message, 400);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Resource already exists';
        error = new AppError(message, 409);
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        const message = 'Referenced resource not found';
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new AppError(message, 401);
    }

    // MongoDB/Database connection errors
    if (err.name === 'MongoError' || err.name === 'ConnectionError') {
        const message = 'Database connection error';
        error = new AppError(message, 503);
    }

    // Rate limiting errors
    if (err.message && err.message.includes('Too Many Requests')) {
        error = new AppError('Too many requests, please try again later', 429);
    }

    // DataForSEO API errors
    if (err.message && err.message.includes('DataForSEO')) {
        const message = 'External API error';
        error = new AppError(message, 502);
    }

    // Default to 500 server error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Send error response
    const errorResponse: any = {
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error,
        }),
    };

    // Add specific error info for development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.timestamp = new Date().toISOString();
        errorResponse.path = req.originalUrl;
        errorResponse.method = req.method;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * Handle async errors without try-catch
 * Wrapper function for async route handlers
 */
export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Handle 404 errors
 * Middleware for routes that don't exist
 */
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

/**
 * Validation error handler
 * Specific handler for request validation errors
 */
export const validationErrorHandler = (error: ValidationError): AppError => {
    const message = error.details
        .map(detail => detail.message.replace(/"/g, ''))
        .join('. ');

    return new AppError(`Validation Error: ${message}`, 400);
};

/**
 * Database error handler
 * Handle common database errors
 */
export const databaseErrorHandler = (error: any): AppError => {
    if (error.code === '23505') {
        return new AppError('Duplicate entry. Resource already exists.', 409);
    }

    if (error.code === '23503') {
        return new AppError('Referenced resource not found.', 400);
    }

    if (error.code === '23502') {
        return new AppError('Required field is missing.', 400);
    }

    return new AppError('Database error occurred.', 500);
};

/**
 * External API error handler
 * Handle errors from external APIs like DataForSEO
 */
export const externalApiErrorHandler = (error: any, apiName: string): AppError => {
    if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || `${apiName} API error`;

        if (status === 401) {
            return new AppError(`${apiName} authentication failed`, 502);
        }

        if (status === 403) {
            return new AppError(`${apiName} access forbidden`, 502);
        }

        if (status === 429) {
            return new AppError(`${apiName} rate limit exceeded`, 429);
        }

        return new AppError(`${apiName} error: ${message}`, 502);
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return new AppError(`${apiName} service unavailable`, 503);
    }

    if (error.code === 'ETIMEDOUT') {
        return new AppError(`${apiName} request timeout`, 504);
    }

    return new AppError(`${apiName} unexpected error`, 502);
};