import { Request, Response, NextFunction } from 'express';
import { ApiUsage } from '../models/apiUsage.model';
import { logger } from '../utils/logger';
import { ApiConfig } from '../config/api.config';

export interface RateLimitInfo {
    current: number;
    limit: number;
    remaining: number;
    resetTime: Date;
    windowMs: number;
}

/**
 * API Usage tracking and rate limiting middleware
 * Tracks API usage per user and enforces quotas
 */
export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Skip rate limiting for health checks and public routes
        const publicRoutes = ['/health', '/api', '/api/auth/login', '/api/auth/register'];
        if (publicRoutes.includes(req.path)) {
            return next();
        }

        // Skip if no user (will be handled by auth middleware)
        if (!req.userId) {
            return next();
        }

        // Determine API type based on route
        const apiType = getApiTypeFromRoute(req.path);
        if (!apiType) {
            return next();
        }

        // Get or create API usage record
        const [apiUsage, created] = await ApiUsage.findOrCreate({
            where: {
                user_id: req.userId,
                api_name: apiType,
            },
            defaults: {
                user_id: req.userId,
                api_name: apiType,
                usage_count: 0,
                quota_limit: ApiConfig.getQuota(apiType).daily,
                reset_date: getNextResetDate(),
            },
        });

        // Check if quota should be reset
        if (apiUsage.shouldReset()) {
            apiUsage.resetUsage();
            await apiUsage.save();
        }

        // Check quota before incrementing
        if (apiUsage.isQuotaExceeded()) {
            logger.warn('Rate limit exceeded', {
                userId: req.userId,
                apiType,
                current: apiUsage.usage_count,
                limit: apiUsage.quota_limit,
            });

            const resetTime = apiUsage.reset_date || getNextResetDate();

            res.status(429).json({
                error: 'Rate limit exceeded',
                message: `Daily quota exceeded for ${apiType} API`,
                rateLimit: {
                    current: apiUsage.usage_count,
                    limit: apiUsage.quota_limit,
                    remaining: 0,
                    resetTime,
                    retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000),
                },
            });
            return;
        }

        // Increment usage count
        apiUsage.incrementUsage();
        await apiUsage.save();

        // Add rate limit info to response headers
        const rateLimitInfo: RateLimitInfo = {
            current: apiUsage.usage_count,
            limit: apiUsage.quota_limit || ApiConfig.getQuota(apiType).daily,
            remaining: Math.max(0, (apiUsage.quota_limit || 0) - apiUsage.usage_count),
            resetTime: apiUsage.reset_date || getNextResetDate(),
            windowMs: 24 * 60 * 60 * 1000, // 24 hours
        };

        // Set rate limit headers
        res.set({
            'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitInfo.resetTime.getTime() / 1000).toString(),
            'X-RateLimit-Used': rateLimitInfo.current.toString(),
        });

        // Attach rate limit info to request for use in controllers
        (req as any).rateLimit = rateLimitInfo;

        logger.debug('API usage tracked', {
            userId: req.userId,
            apiType,
            usage: rateLimitInfo.current,
            limit: rateLimitInfo.limit,
            remaining: rateLimitInfo.remaining,
        });

        next();
    } catch (error) {
        logger.error('Rate limit middleware error', { error, userId: req.userId });

        // Don't block request on rate limit error, just log and continue
        next();
    }
};

/**
 * Concurrent request limiting
 * Prevents too many simultaneous requests from same user
 */
export const concurrentLimitMiddleware = (maxConcurrent: number = 5) => {
    const activeRequests = new Map<number, number>();

    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.userId) {
            return next();
        }

        const currentCount = activeRequests.get(req.userId) || 0;

        if (currentCount >= maxConcurrent) {
            res.status(429).json({
                error: 'Too many concurrent requests',
                message: `Maximum ${maxConcurrent} concurrent requests allowed`,
                current: currentCount,
                limit: maxConcurrent,
            });
            return;
        }

        // Increment counter
        activeRequests.set(req.userId, currentCount + 1);

        // Decrement on response finish
        res.on('finish', () => {
            const newCount = (activeRequests.get(req.userId!) || 1) - 1;
            if (newCount <= 0) {
                activeRequests.delete(req.userId!);
            } else {
                activeRequests.set(req.userId!, newCount);
            }
        });

        next();
    };
};

/**
 * API-specific rate limiting
 * Different limits for different API endpoints
 */
export const apiSpecificRateLimit = (apiType: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.userId) {
                return next();
            }

            const rateLimit = ApiConfig.getRateLimit(apiType);
            const windowStart = Date.now() - rateLimit.windowMs;

            // This is a simplified implementation
            // In production, you'd use Redis or similar for distributed rate limiting
            const key = `rate_limit:${req.userId}:${apiType}`;

            // For now, we'll use the existing API usage tracking
            // In a full implementation, you'd track requests per minute/hour separately

            next();
        } catch (error) {
            logger.error('API-specific rate limit error', { error, apiType, userId: req.userId });
            next();
        }
    };
};

/**
 * Export control for specific resources
 * Limit exports per user per day
 */
export const exportRateLimit = (maxExports: number = 10) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.userId) {
                return next();
            }

            const [exportUsage, created] = await ApiUsage.findOrCreate({
                where: {
                    user_id: req.userId,
                    api_name: 'EXPORT',
                },
                defaults: {
                    user_id: req.userId,
                    api_name: 'EXPORT',
                    usage_count: 0,
                    quota_limit: maxExports,
                    reset_date: getNextResetDate(),
                },
            });

            if (exportUsage.shouldReset()) {
                exportUsage.resetUsage();
                await exportUsage.save();
            }

            if (exportUsage.isQuotaExceeded()) {
                res.status(429).json({
                    error: 'Export limit exceeded',
                    message: `Daily export limit of ${maxExports} exceeded`,
                    current: exportUsage.usage_count,
                    limit: maxExports,
                    resetTime: exportUsage.reset_date,
                });
                return;
            }

            exportUsage.incrementUsage();
            await exportUsage.save();

            next();
        } catch (error) {
            logger.error('Export rate limit error', { error, userId: req.userId });
            next();
        }
    };
};

/**
 * Helper function to determine API type from route
 */
function getApiTypeFromRoute(path: string): string | null {
    if (path.includes('/keyword-explorer')) {
        return 'KEYWORDS_DATA';
    }
    if (path.includes('/url-analyzer')) {
        return 'ON_PAGE';
    }
    if (path.includes('/rank-monitor')) {
        return 'SERP';
    }
    return null;
}

/**
 * Helper function to get next reset date (midnight)
 */
function getNextResetDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

/**
 * Get rate limit status for a user
 */
export const getRateLimitStatus = async (
    userId: number,
    apiType?: string
): Promise<RateLimitInfo[]> => {
    try {
        const where: any = { user_id: userId };
        if (apiType) {
            where.api_name = apiType;
        }

        const usageRecords = await ApiUsage.findAll({ where });

        return usageRecords.map(usage => ({
            current: usage.usage_count,
            limit: usage.quota_limit || 0,
            remaining: Math.max(0, (usage.quota_limit || 0) - usage.usage_count),
            resetTime: usage.reset_date || getNextResetDate(),
            windowMs: 24 * 60 * 60 * 1000,
        }));
    } catch (error) {
        logger.error('Error getting rate limit status', { error, userId, apiType });
        return [];
    }
};