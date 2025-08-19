import { TaskCost } from '../models/taskCost.model';
import { UserDashboardStats } from '../models/userDashboardStats.model';
import { KeywordsForKeywordsTask } from '../models/keywordsForKeywords.model';
import { KeywordsForSiteTask } from '../models/keywordsForSite.model';
import { RelatedKeywordsTask } from '../models/relatedKeywords.model';
import { SerpTask } from '../models/serpTask.model';
import { OnPageTask } from '../models/onPageTask.model';
import { ContentAnalysisSummaryTask } from '../models/contentAnalysisSummary.model';
import { DomainRankOverviewTask } from '../models/domainRankOverview.model';
import { DomainCompetitorsTask } from '../models/domainCompetitors.model';
import { Op } from 'sequelize';

export interface DashboardStats {
    userId: number;
    overview: {
        totalApiCalls: number;
        totalCost: number;
        todayApiCalls: number;
        todayCost: number;
        thisMonthApiCalls: number;
        thisMonthCost: number;
        avgCostPerTask: number;
        lastApiCall: Date | null;
    };
    tasksByType: {
        keywordsTasks: number;
        serpTasks: number;
        onpageTasks: number;
        contentAnalysisTasks: number;
        domainAnalysisTasks: number;
    };
    costsByType: Array<{
        taskType: string;
        totalCost: number;
        taskCount: number;
        avgCost: number;
    }>;
    recentActivity: Array<{
        taskId: string;
        taskType: string;
        cost: number;
        createdAt: Date;
        endpoint: string;
    }>;
    monthlyTrend: Array<{
        month: string;
        apiCalls: number;
        cost: number;
    }>;
    topEndpoints: Array<{
        endpoint: string;
        callCount: number;
        totalCost: number;
    }>;
}

export class DashboardService {
    /**
     * Calcule et retourne toutes les statistiques du dashboard pour un utilisateur
     */
    static async getUserDashboardStats(userId: number): Promise<DashboardStats> {
        try {
            const [
                overview,
                tasksByType,
                costsByType,
                recentActivity,
                monthlyTrend,
                topEndpoints
            ] = await Promise.all([
                this.getOverviewStats(userId),
                this.getTasksByType(userId),
                this.getCostsByType(userId),
                this.getRecentActivity(userId),
                this.getMonthlyTrend(userId),
                this.getTopEndpoints(userId)
            ]);

            return {
                userId,
                overview,
                tasksByType,
                costsByType,
                recentActivity,
                monthlyTrend,
                topEndpoints
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Obtient les statistiques générales
     */
    private static async getOverviewStats(userId: number) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        const [totalStats, todayStats, monthStats, lastActivity] = await Promise.all([
            TaskCost.findAll({
                attributes: [
                    [TaskCost.sequelize!.fn('COUNT', '*'), 'count'],
                    [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'totalCost']
                ],
                where: { user_id: userId },
                raw: true
            }),
            TaskCost.findAll({
                attributes: [
                    [TaskCost.sequelize!.fn('COUNT', '*'), 'count'],
                    [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'totalCost']
                ],
                where: {
                    user_id: userId,
                    created_at: { [Op.between]: [startOfDay, endOfDay] }
                },
                raw: true
            }),
            TaskCost.findAll({
                attributes: [
                    [TaskCost.sequelize!.fn('COUNT', '*'), 'count'],
                    [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'totalCost']
                ],
                where: {
                    user_id: userId,
                    created_at: { [Op.between]: [startOfMonth, endOfMonth] }
                },
                raw: true
            }),
            TaskCost.findOne({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                attributes: ['created_at']
            })
        ]);

        const total = totalStats[0] as any;
        const today_data = todayStats[0] as any;
        const month = monthStats[0] as any;

        return {
            totalApiCalls: parseInt(total.count) || 0,
            totalCost: parseFloat(total.totalCost) || 0,
            todayApiCalls: parseInt(today_data.count) || 0,
            todayCost: parseFloat(today_data.totalCost) || 0,
            thisMonthApiCalls: parseInt(month.count) || 0,
            thisMonthCost: parseFloat(month.totalCost) || 0,
            avgCostPerTask: (parseInt(total.count) > 0) ? (parseFloat(total.totalCost) / parseInt(total.count)) : 0,
            lastApiCall: lastActivity?.created_at || null
        };
    }

    /**
     * Obtient le nombre de tâches par type
     */
    private static async getTasksByType(userId: number) {
        const taskQueries = [
            this.countTasksForModel(KeywordsForKeywordsTask, userId),
            this.countTasksForModel(SerpTask, userId),
            this.countTasksForModel(OnPageTask, userId),
            this.countTasksForModel(ContentAnalysisSummaryTask, userId),
            this.countTasksForModel(DomainRankOverviewTask, userId),
            this.countTasksForModel(DomainCompetitorsTask, userId)
        ];

        const [keywords, serp, onpage, content, domain, competitors] = await Promise.all(taskQueries);

        return {
            keywordsTasks: keywords,
            serpTasks: serp,
            onpageTasks: onpage,
            contentAnalysisTasks: content,
            domainAnalysisTasks: domain + competitors
        };
    }

    /**
     * Compte les tâches pour un modèle spécifique
     */
    private static async countTasksForModel(model: any, userId: number): Promise<number> {
        try {
            if (model === KeywordsForKeywordsTask || model === KeywordsForSiteTask ||
                model === SerpTask || model === OnPageTask ||
                model === ContentAnalysisSummaryTask || model === DomainRankOverviewTask ||
                model === DomainCompetitorsTask) {
                return await model.count();
            } else if (model === RelatedKeywordsTask) {
                return await model.count({ where: { user_id: userId } });
            }
            return 0;
        } catch (error) {
            console.error(`Error counting tasks for model:`, error);
            return 0;
        }
    }

    /**
     * Obtient les coûts par type de tâche
     */
    private static async getCostsByType(userId: number) {
        const results = await TaskCost.findAll({
            attributes: [
                'task_type',
                [TaskCost.sequelize!.fn('COUNT', '*'), 'taskCount'],
                [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'totalCost'],
                [TaskCost.sequelize!.fn('AVG', TaskCost.sequelize!.col('cost')), 'avgCost']
            ],
            where: { user_id: userId },
            group: ['task_type'],
            raw: true
        });

        return results.map((item: any) => ({
            taskType: item.task_type,
            totalCost: parseFloat(item.totalCost) || 0,
            taskCount: parseInt(item.taskCount) || 0,
            avgCost: parseFloat(item.avgCost) || 0
        }));
    }

    /**
     * Obtient l'activité récente
     */
    private static async getRecentActivity(userId: number, limit: number = 10) {
        const activities = await TaskCost.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit,
            attributes: ['task_id', 'task_type', 'cost', 'created_at', 'api_endpoint']
        });

        return activities.map(activity => ({
            taskId: activity.task_id,
            taskType: activity.task_type,
            cost: activity.cost,
            createdAt: activity.created_at,
            endpoint: activity.api_endpoint
        }));
    }

    /**
     * Obtient la tendance mensuelle (6 derniers mois)
     */
    private static async getMonthlyTrend(userId: number) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const results = await TaskCost.findAll({
            attributes: [
                [TaskCost.sequelize!.fn('DATE_TRUNC', 'month', TaskCost.sequelize!.col('created_at')), 'month'],
                [TaskCost.sequelize!.fn('COUNT', '*'), 'apiCalls'],
                [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'cost']
            ],
            where: {
                user_id: userId,
                created_at: { [Op.gte]: sixMonthsAgo }
            },
            group: [TaskCost.sequelize!.fn('DATE_TRUNC', 'month', TaskCost.sequelize!.col('created_at'))],
            order: [[TaskCost.sequelize!.fn('DATE_TRUNC', 'month', TaskCost.sequelize!.col('created_at')), 'ASC']],
            raw: true
        });

        return results.map((item: any) => ({
            month: new Date(item.month).toISOString().slice(0, 7), // Format YYYY-MM
            apiCalls: parseInt(item.apiCalls) || 0,
            cost: parseFloat(item.cost) || 0
        }));
    }

    /**
     * Obtient les endpoints les plus utilisés
     */
    private static async getTopEndpoints(userId: number, limit: number = 5) {
        const results = await TaskCost.findAll({
            attributes: [
                'api_endpoint',
                [TaskCost.sequelize!.fn('COUNT', '*'), 'callCount'],
                [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'totalCost']
            ],
            where: { user_id: userId },
            group: ['api_endpoint'],
            order: [[TaskCost.sequelize!.fn('COUNT', '*'), 'DESC']],
            limit,
            raw: true
        });

        return results.map((item: any) => ({
            endpoint: item.api_endpoint,
            callCount: parseInt(item.callCount) || 0,
            totalCost: parseFloat(item.totalCost) || 0
        }));
    }

    /**
     * Met à jour ou crée les statistiques en cache pour un utilisateur
     */
    static async updateUserDashboardCache(userId: number): Promise<UserDashboardStats> {
        try {
            const stats = await this.getUserDashboardStats(userId);

            const [dashboardStats, created] = await UserDashboardStats.upsert({
                user_id: userId,
                total_api_calls: stats.overview.totalApiCalls,
                total_cost: stats.overview.totalCost,
                today_api_calls: stats.overview.todayApiCalls,
                today_cost: stats.overview.todayCost,
                this_month_api_calls: stats.overview.thisMonthApiCalls,
                this_month_cost: stats.overview.thisMonthCost,
                keywords_tasks_count: stats.tasksByType.keywordsTasks,
                serp_tasks_count: stats.tasksByType.serpTasks,
                onpage_tasks_count: stats.tasksByType.onpageTasks,
                content_analysis_tasks_count: stats.tasksByType.contentAnalysisTasks,
                domain_analysis_tasks_count: stats.tasksByType.domainAnalysisTasks,
                most_used_api: stats.topEndpoints[0]?.endpoint || null,
                avg_cost_per_task: stats.overview.avgCostPerTask,
                last_api_call: stats.overview.lastApiCall
            });

            return dashboardStats;
        } catch (error) {
            console.error('Error updating dashboard cache:', error);
            throw error;
        }
    }
}
