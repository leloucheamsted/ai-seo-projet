import dotenv from 'dotenv';

dotenv.config();

export interface DataForSEOCredentials {
    login: string;
    password: string;
}

export interface ApiQuota {
    daily: number;
    monthly: number;
    concurrent: number;
}

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    retryAfter: number;
}

export class ApiConfig {
    // DataForSEO credentials (deprecated: use getDataForSEOCredentials)
    static readonly DATAFORSEO: DataForSEOCredentials = {
        login: process.env.DATAFORSEO_LOGIN || '',
        password: process.env.DATAFORSEO_PASSWORD || '',
    };

    /**
     * Get DataForSEO credentials for a user (from DB)
     */
    static async getDataForSEOCredentials(userId: number): Promise<DataForSEOCredentials> {
        const { DataForSEOCredentialsRepository } = require('../repositories/dataforseoCredentials.repository');
        const creds = await DataForSEOCredentialsRepository.getByUserId(userId);
        if (!creds) throw new Error('No DataForSEO credentials found for this user');
        return { login: creds.login, password: creds.password };
    }

    // Base URLs for DataForSEO APIs
    static readonly BASE_URLS = {
        KEYWORDS_DATA: 'https://api.dataforseo.com/v3/keywords_data',
        DATAFORSEO_LABS: 'https://api.dataforseo.com/v3/dataforseo_labs',
        SERP: 'https://api.dataforseo.com/v3/serp',
        DOMAIN_ANALYTICS: 'https://api.dataforseo.com/v3/domain_analytics',
        ON_PAGE: 'https://api.dataforseo.com/v3/on_page',
        CONTENT_ANALYSIS: 'https://api.dataforseo.com/v3/content_analysis',
    };

    // API Endpoints for each service
    static readonly ENDPOINTS = {
        // Keywords Data API
        KEYWORD_IDEAS: '/keywords_data/google_ads/keywords_for_keywords/live',
        KEYWORD_METRICS: '/keywords_data/google_ads/ad_traffic_by_keywords/live',

        // DataForSEO Labs API
        KEYWORD_CLUSTERING: '/dataforseo_labs/google/bulk_keyword_difficulty/live',
        KEYWORD_SUGGESTIONS: '/dataforseo_labs/google/keyword_suggestions/live',

        // SERP API
        SERP_LIVE: '/serp/google/organic/live/advanced',
        SERP_FEATURES: '/serp/google/organic/live/regular',

        // Domain Analytics API
        DOMAIN_OVERVIEW: '/domain_analytics/google/overview/live',
        DOMAIN_PAGES: '/domain_analytics/google/pages/live',

        // OnPage API
        ONPAGE_SUMMARY: '/on_page/summary',
        ONPAGE_PAGES: '/on_page/pages',
        ONPAGE_LIGHTHOUSE: '/on_page/lighthouse',

        // Content Analysis API
        CONTENT_SUMMARY: '/content_analysis/summary/live',
        CONTENT_SENTIMENT: '/content_analysis/sentiment/live',
    };

    // Default quotas for different API types
    static readonly DEFAULT_QUOTAS: Record<string, ApiQuota> = {
        KEYWORDS_DATA: {
            daily: 10000,
            monthly: 300000,
            concurrent: 30,
        },
        DATAFORSEO_LABS: {
            daily: 5000,
            monthly: 150000,
            concurrent: 20,
        },
        SERP: {
            daily: 5000,
            monthly: 150000,
            concurrent: 30,
        },
        DOMAIN_ANALYTICS: {
            daily: 1000,
            monthly: 30000,
            concurrent: 10,
        },
        ON_PAGE: {
            daily: 500,
            monthly: 15000,
            concurrent: 5,
        },
        CONTENT_ANALYSIS: {
            daily: 1000,
            monthly: 30000,
            concurrent: 10,
        },
    };

    // Rate limiting configuration
    static readonly RATE_LIMITS: Record<string, RateLimitConfig> = {
        KEYWORDS_DATA: {
            windowMs: 60 * 1000, // 1 minute
            maxRequests: 30,
            retryAfter: 2000, // 2 seconds
        },
        DATAFORSEO_LABS: {
            windowMs: 60 * 1000,
            maxRequests: 20,
            retryAfter: 3000,
        },
        SERP: {
            windowMs: 60 * 1000,
            maxRequests: 30,
            retryAfter: 2000,
        },
        DOMAIN_ANALYTICS: {
            windowMs: 60 * 1000,
            maxRequests: 10,
            retryAfter: 6000,
        },
        ON_PAGE: {
            windowMs: 60 * 1000,
            maxRequests: 5,
            retryAfter: 12000,
        },
        CONTENT_ANALYSIS: {
            windowMs: 60 * 1000,
            maxRequests: 10,
            retryAfter: 6000,
        },
    };

    // Cache TTL for different types of data (in seconds)
    static readonly CACHE_TTL = {
        KEYWORD_METRICS: 24 * 60 * 60, // 24 hours
        SERP_RESULTS: 6 * 60 * 60, // 6 hours
        DOMAIN_OVERVIEW: 12 * 60 * 60, // 12 hours
        ONPAGE_AUDIT: 1 * 60 * 60, // 1 hour
        CONTENT_ANALYSIS: 2 * 60 * 60, // 2 hours
    };

    // Request timeout configurations
    static readonly TIMEOUTS = {
        KEYWORDS_DATA: 30000, // 30 seconds
        DATAFORSEO_LABS: 45000, // 45 seconds
        SERP: 30000,
        DOMAIN_ANALYTICS: 60000, // 1 minute
        ON_PAGE: 120000, // 2 minutes
        CONTENT_ANALYSIS: 90000, // 1.5 minutes
    };

    // Location and language codes
    static readonly LOCATIONS = {
        US: 2840, // United States
        UK: 2826, // United Kingdom
        CA: 2124, // Canada
        AU: 2036, // Australia
        FR: 2250, // France
        DE: 2276, // Germany
        ES: 2724, // Spain
        IT: 2380, // Italy
    };

    static readonly LANGUAGES = {
        EN: 'en', // English
        FR: 'fr', // French
        DE: 'de', // German
        ES: 'es', // Spanish
        IT: 'it', // Italian
    };

    /**
     * Get full URL for an API endpoint
     */
    static getFullUrl(service: keyof typeof ApiConfig.BASE_URLS, endpoint: string): string {
        return `${this.BASE_URLS[service]}${endpoint}`;
    }

    /**
     * Get Basic Auth header for DataForSEO
     */
    static getAuthHeader(): string {
        const credentials = Buffer.from(`${this.DATAFORSEO.login}:${this.DATAFORSEO.password}`).toString('base64');
        return `Basic ${credentials}`;
    }

    /**
     * Validate API configuration
     */
    static validateConfig(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.DATAFORSEO.login) {
            errors.push('DATAFORSEO_LOGIN is required');
        }

        if (!this.DATAFORSEO.password) {
            errors.push('DATAFORSEO_PASSWORD is required');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Get quota for specific API service
     */
    static getQuota(service: string): ApiQuota {
        return this.DEFAULT_QUOTAS[service] || this.DEFAULT_QUOTAS.KEYWORDS_DATA;
    }

    /**
     * Get rate limit for specific API service
     */
    static getRateLimit(service: string): RateLimitConfig {
        return this.RATE_LIMITS[service] || this.RATE_LIMITS.KEYWORDS_DATA;
    }

    /**
     * Get cache TTL for specific data type
     */
    static getCacheTTL(dataType: keyof typeof ApiConfig.CACHE_TTL): number {
        return this.CACHE_TTL[dataType];
    }

    /**
     * Get timeout for specific service
     */
    static getTimeout(service: keyof typeof ApiConfig.TIMEOUTS): number {
        return this.TIMEOUTS[service];
    }

    /**
     * Get default request headers
     */
    static getDefaultHeaders(): Record<string, string> {
        return {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json',
            'User-Agent': 'IA-SEO-MVP/1.0',
        };
    }
}