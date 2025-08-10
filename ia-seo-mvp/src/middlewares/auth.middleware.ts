import { Request, Response, NextFunction } from 'express';
import { JwtConfig, JwtPayload } from '../config/jwt.config';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: User;
            userId?: number;
        }
    }
}

export interface AuthenticatedRequest extends Request {
    user: User;
    userId: number;
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from Authorization header
        const token = JwtConfig.extractTokenFromHeader(req.headers.authorization);

        if (!token) {
            res.status(401).json({
                error: 'Access denied',
                message: 'No token provided. Please include Authorization header with Bearer token.',
            });
            return;
        }

        // Verify token
        let decoded: JwtPayload;
        try {
            decoded = JwtConfig.verifyToken(token);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Token verification failed';

            res.status(401).json({
                error: 'Invalid token',
                message: errorMessage,
            });
            return;
        }

        // Find user in database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(401).json({
                error: 'Invalid token',
                message: 'User not found. Token may be outdated.',
            });
            return;
        }

        // Attach user to request
        req.user = user;
        req.userId = user.id;

        logger.debug('User authenticated', {
            userId: user.id,
            email: user.email,
            route: req.path,
        });

        next();
    } catch (error) {
        logger.error('Authentication middleware error', { error });

        res.status(500).json({
            error: 'Authentication error',
            message: 'Internal server error during authentication.',
        });
    }
};

/**
 * Optional Authentication Middleware
 * Attempts to authenticate but doesn't fail if no token
 */
export const optionalAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = JwtConfig.extractTokenFromHeader(req.headers.authorization);

        if (token) {
            try {
                const decoded = JwtConfig.verifyToken(token);
                const user = await User.findByPk(decoded.userId);

                if (user) {
                    req.user = user;
                    req.userId = user.id;
                }
            } catch (error) {
                // Silently fail for optional auth
                logger.debug('Optional auth failed', { error });
            }
        }

        next();
    } catch (error) {
        logger.error('Optional authentication middleware error', { error });
        next(); // Continue even if error
    }
};

/**
 * Role-based access control middleware
 * Note: For MVP, we don't have roles, but structure is ready for future
 */
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Access denied',
                message: 'Authentication required.',
            });
            return;
        }

        // For MVP, all authenticated users have access
        // In future, check user.role against roles array
        next();
    };
};

/**
 * Check if user owns resource
 * Used for resource-specific access control
 */
export const requireOwnership = (
    userIdField: string = 'user_id'
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Access denied',
                message: 'Authentication required.',
            });
            return;
        }

        // Extract resource user ID from params, body, or query
        const resourceUserId =
            req.params[userIdField] ||
            req.body[userIdField] ||
            req.query[userIdField];

        if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied. You can only access your own resources.',
            });
            return;
        }

        next();
    };
};

/**
 * Rate limiting per user
 * Check API usage against user quotas
 */
export const checkUserQuota = (apiType: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'Access denied',
                    message: 'Authentication required for quota check.',
                });
                return;
            }

            // Import here to avoid circular dependency
            const { ApiUsage } = await import('../models/apiUsage.model');

            const usage = await ApiUsage.findOne({
                where: {
                    user_id: req.user.id,
                    api_name: apiType,
                },
            });

            if (usage && usage.isQuotaExceeded()) {
                res.status(429).json({
                    error: 'Quota exceeded',
                    message: `Daily quota exceeded for ${apiType} API.`,
                    quotaInfo: {
                        current: usage.usage_count,
                        limit: usage.quota_limit,
                        resetDate: usage.reset_date,
                    },
                });
                return;
            }

            next();
        } catch (error) {
            logger.error('Quota check error', { error, apiType, userId: req.user?.id });

            res.status(500).json({
                error: 'Quota check failed',
                message: 'Unable to verify API quota.',
            });
        }
    };
};