import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { DashboardService } from '../services/dashboard.service';
import { UserDashboardStats } from '../models/userDashboardStats.model';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API des statistiques et dashboard utilisateur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardOverview:
 *       type: object
 *       properties:
 *         totalApiCalls:
 *           type: integer
 *           description: Nombre total d'appels API
 *         totalCost:
 *           type: number
 *           format: float
 *           description: Coût total des appels API
 *         todayApiCalls:
 *           type: integer
 *           description: Nombre d'appels API aujourd'hui
 *         todayCost:
 *           type: number
 *           format: float
 *           description: Coût des appels API aujourd'hui
 *         thisMonthApiCalls:
 *           type: integer
 *           description: Nombre d'appels API ce mois
 *         thisMonthCost:
 *           type: number
 *           format: float
 *           description: Coût des appels API ce mois
 *         avgCostPerTask:
 *           type: number
 *           format: float
 *           description: Coût moyen par tâche
 *         lastApiCall:
 *           type: string
 *           format: date-time
 *           description: Date du dernier appel API
 *     
 *     TasksByType:
 *       type: object
 *       properties:
 *         keywordsTasks:
 *           type: integer
 *           description: Nombre de tâches de mots-clés
 *         serpTasks:
 *           type: integer
 *           description: Nombre de tâches SERP
 *         onpageTasks:
 *           type: integer
 *           description: Nombre de tâches OnPage
 *         contentAnalysisTasks:
 *           type: integer
 *           description: Nombre de tâches d'analyse de contenu
 *         domainAnalysisTasks:
 *           type: integer
 *           description: Nombre de tâches d'analyse de domaine
 *     
 *     CostByType:
 *       type: object
 *       properties:
 *         taskType:
 *           type: string
 *           description: Type de tâche
 *         totalCost:
 *           type: number
 *           format: float
 *           description: Coût total pour ce type
 *         taskCount:
 *           type: integer
 *           description: Nombre de tâches de ce type
 *         avgCost:
 *           type: number
 *           format: float
 *           description: Coût moyen pour ce type
 *     
 *     RecentActivity:
 *       type: object
 *       properties:
 *         taskId:
 *           type: string
 *           description: ID de la tâche
 *         taskType:
 *           type: string
 *           description: Type de tâche
 *         cost:
 *           type: number
 *           format: float
 *           description: Coût de la tâche
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         endpoint:
 *           type: string
 *           description: Endpoint API utilisé
 *     
 *     MonthlyTrend:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *           description: Mois au format YYYY-MM
 *         apiCalls:
 *           type: integer
 *           description: Nombre d'appels API ce mois
 *         cost:
 *           type: number
 *           format: float
 *           description: Coût total ce mois
 *     
 *     TopEndpoint:
 *       type: object
 *       properties:
 *         endpoint:
 *           type: string
 *           description: Nom de l'endpoint
 *         callCount:
 *           type: integer
 *           description: Nombre d'appels
 *         totalCost:
 *           type: number
 *           format: float
 *           description: Coût total
 *     
 *     DashboardStats:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID de l'utilisateur
 *         overview:
 *           $ref: '#/components/schemas/DashboardOverview'
 *         tasksByType:
 *           $ref: '#/components/schemas/TasksByType'
 *         costsByType:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CostByType'
 *         recentActivity:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecentActivity'
 *         monthlyTrend:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MonthlyTrend'
 *         topEndpoints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopEndpoint'
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtenir toutes les statistiques du dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Obtenir un aperçu des statistiques principales
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aperçu des statistiques récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardOverview'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getDashboardOverview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.overview
        });
    } catch (error) {
        console.error('Error in getDashboardOverview:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'aperçu'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/tasks-by-type:
 *   get:
 *     summary: Obtenir le nombre de tâches par type
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de tâches par type récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TasksByType'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getTasksByType = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.tasksByType
        });
    } catch (error) {
        console.error('Error in getTasksByType:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des tâches par type'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/costs-by-type:
 *   get:
 *     summary: Obtenir les coûts par type de tâche
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coûts par type récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CostByType'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getCostsByType = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.costsByType
        });
    } catch (error) {
        console.error('Error in getCostsByType:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des coûts par type'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Obtenir l'activité récente
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre maximum d'activités à retourner
 *     responses:
 *       200:
 *         description: Activité récente récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentActivity'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getRecentActivity = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.recentActivity
        });
    } catch (error) {
        console.error('Error in getRecentActivity:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'activité récente'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/monthly-trend:
 *   get:
 *     summary: Obtenir la tendance mensuelle des coûts et appels API
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tendance mensuelle récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MonthlyTrend'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getMonthlyTrend = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.monthlyTrend
        });
    } catch (error) {
        console.error('Error in getMonthlyTrend:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la tendance mensuelle'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/top-endpoints:
 *   get:
 *     summary: Obtenir les endpoints les plus utilisés
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre maximum d'endpoints à retourner
 *     responses:
 *       200:
 *         description: Top endpoints récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopEndpoint'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const getTopEndpoints = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const stats = await DashboardService.getUserDashboardStats(userId);

        res.json({
            success: true,
            data: stats.topEndpoints
        });
    } catch (error) {
        console.error('Error in getTopEndpoints:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des top endpoints'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/cache/refresh:
 *   post:
 *     summary: Actualiser le cache des statistiques utilisateur
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache actualisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cache des statistiques actualisé avec succès"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
export const refreshCache = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        await DashboardService.updateUserDashboardCache(userId);

        res.json({
            success: true,
            message: 'Cache des statistiques actualisé avec succès'
        });
    } catch (error) {
        console.error('Error in refreshCache:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'actualisation du cache'
        });
    }
};

/**
 * @swagger
 * /api/dashboard/cache:
 *   get:
 *     summary: Obtenir les statistiques depuis le cache
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques en cache récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Données des statistiques en cache
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucune donnée en cache trouvée
 *       500:
 *         description: Erreur serveur
 */
export const getCachedStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const cachedStats = await UserDashboardStats.findOne({
            where: { user_id: userId }
        });

        if (!cachedStats) {
            return res.status(404).json({
                success: false,
                message: 'Aucune donnée en cache trouvée'
            });
        }

        res.json({
            success: true,
            data: cachedStats
        });
    } catch (error) {
        console.error('Error in getCachedStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques en cache'
        });
    }
};