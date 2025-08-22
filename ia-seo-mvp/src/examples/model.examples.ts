/**
 * Example usage of the models
 * This file demonstrates how to use the TypeScript models with Sequelize
 */

import {
    User,
    KeywordSearch,
    Keyword,
    UrlAudit,
    UrlAuditTechnical,
    UrlAuditContent,
    RankMonitor,
    RankAlert,
    ApiUsage,
    Alert,
    DomainVisibility,
} from '../models';

export class ModelExamples {
    /**
     * Create a new user
     */
    static async createUser(email: string, passwordHash: string, firstName: string = 'John', lastName: string = 'Doe'): Promise<User> {
        return await User.create({
            email,
            password_hash: passwordHash,
            firstName,
            lastName,
        });
    }

    /**
     * Create a keyword search for a user
     */
    static async createKeywordSearch(userId: number, keyword: string): Promise<KeywordSearch> {
        return await KeywordSearch.create({
            user_id: userId,
            keyword,
        });
    }

    /**
     * Add keywords with metrics to a search
     */
    static async addKeywordMetrics(
        keywordSearchId: number,
        keywordData: {
            keyword_text: string;
            search_volume?: number;
            cpc?: number;
            keyword_difficulty?: number;
            search_intent?: string;
            opportunity_score?: number;
            serp_snapshot?: any;
        }
    ): Promise<Keyword> {
        return await Keyword.create({
            keyword_search_id: keywordSearchId,
            ...keywordData,
        });
    }

    /**
     * Create a URL audit request
     */
    static async createUrlAudit(userId: number, url: string): Promise<UrlAudit> {
        return await UrlAudit.create({
            user_id: userId,
            url,
            status: 'pending',
        });
    }

    /**
     * Add technical audit results
     */
    static async addTechnicalResults(
        urlAuditId: number,
        results: {
            core_web_vitals?: any;
            technical_errors?: any;
            score?: number;
        }
    ): Promise<UrlAuditTechnical> {
        return await UrlAuditTechnical.create({
            url_audit_id: urlAuditId,
            ...results,
        });
    }

    /**
     * Add content analysis results
     */
    static async addContentResults(
        urlAuditId: number,
        results: {
            semantic_score?: number;
            missing_entities?: any;
        }
    ): Promise<UrlAuditContent> {
        return await UrlAuditContent.create({
            url_audit_id: urlAuditId,
            ...results,
        });
    }

    /**
     * Create rank monitoring entry
     */
    static async createRankMonitor(
        userId: number,
        domain: string,
        keyword: string,
        trackedDate: Date,
        options?: {
            competitor_domain?: string;
            current_position?: number;
            serp_features?: any;
        }
    ): Promise<RankMonitor> {
        return await RankMonitor.create({
            user_id: userId,
            domain,
            keyword,
            tracked_date: trackedDate,
            ...options,
        });
    }

    /**
     * Create rank alert
     */
    static async createRankAlert(
        userId: number,
        rankMonitorId: number,
        alertType: 'gain' | 'perte' | 'autre',
        message: string
    ): Promise<RankAlert> {
        return await RankAlert.create({
            user_id: userId,
            rank_monitor_id: rankMonitorId,
            alert_type: alertType,
            message,
        });
    }

    /**
     * Track API usage
     */
    static async trackApiUsage(
        userId: number,
        apiName: string,
        quotaLimit?: number
    ): Promise<ApiUsage> {
        const [apiUsage, created] = await ApiUsage.findOrCreate({
            where: { user_id: userId, api_name: apiName },
            defaults: {
                user_id: userId,
                api_name: apiName,
                usage_count: 1,
                quota_limit: quotaLimit,
                reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
        });

        if (!created) {
            apiUsage.incrementUsage();
            await apiUsage.save();
        }

        return apiUsage;
    }

    /**
     * Create a general alert
     */
    static async createAlert(
        userId: number,
        type: 'rank_change' | 'audit_complete' | 'quota_exceeded' | 'system',
        title: string,
        message: string,
        priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium',
        scheduledAt?: Date
    ): Promise<Alert> {
        return await Alert.create({
            user_id: userId,
            type,
            title,
            message,
            priority,
            scheduled_at: scheduledAt,
        });
    }

    /**
     * Get user with all related data
     */
    static async getUserWithRelations(userId: number): Promise<User | null> {
        return await User.findByPk(userId, {
            include: [
                {
                    association: 'keywordSearches',
                    include: ['keywords'],
                },
                {
                    association: 'urlAudits',
                    include: ['technicalResults', 'contentResults'],
                },
                'rankMonitors',
                'rankAlerts',
                'apiUsages',
                'alerts',
            ],
        });
    }

    /**
     * Get pending alerts for a user
     */
    static async getPendingAlerts(userId: number): Promise<Alert[]> {
        return await Alert.findAll({
            where: {
                user_id: userId,
                status: 'pending',
            },
            order: [['priority', 'DESC'], ['created_at', 'ASC']],
        });
    }

    /**
     * Get API usage summary for a user
     */
    static async getApiUsageSummary(userId: number): Promise<ApiUsage[]> {
        return await ApiUsage.findAll({
            where: { user_id: userId },
            order: [['api_name', 'ASC']],
        });
    }

    /**
     * Update URL audit status
     */
    static async updateUrlAuditStatus(
        auditId: number,
        status: 'pending' | 'completed' | 'failed'
    ): Promise<void> {
        await UrlAudit.update(
            {
                status,
                completed_at: status === 'completed' ? new Date() : undefined,
            },
            {
                where: { id: auditId },
            }
        );
    }

    /**
     * Get recent rank changes
     */
    static async getRecentRankChanges(userId: number, days: number = 7): Promise<RankMonitor[]> {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        return await RankMonitor.findAll({
            where: {
                user_id: userId,
                tracked_date: {
                    [require('sequelize').Op.gte]: since,
                },
            },
            order: [['tracked_date', 'DESC']],
            include: ['alerts'],
        });
    }
}
