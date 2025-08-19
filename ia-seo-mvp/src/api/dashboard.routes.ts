import { Router, RequestHandler } from 'express';
import {
    getDashboardStats,
    getDashboardOverview,
    getTasksByType,
    getCostsByType,
    getRecentActivity,
    getMonthlyTrend,
    getTopEndpoints,
    refreshCache,
    getCachedStats
} from './dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

/**
 * Routes du Dashboard
 */

// Statistiques complètes du dashboard
router.get('/stats', getDashboardStats as RequestHandler);

// Aperçu des statistiques principales
router.get('/overview', getDashboardOverview as RequestHandler);

// Nombre de tâches par type
router.get('/tasks-by-type', getTasksByType as RequestHandler);

// Coûts par type de tâche
router.get('/costs-by-type', getCostsByType as RequestHandler);

// Activité récente
router.get('/recent-activity', getRecentActivity as RequestHandler);

// Tendance mensuelle
router.get('/monthly-trend', getMonthlyTrend as RequestHandler);

// Endpoints les plus utilisés
router.get('/top-endpoints', getTopEndpoints as RequestHandler);

// Gestion du cache
router.post('/cache/refresh', refreshCache as RequestHandler);
router.get('/cache', getCachedStats as RequestHandler);

export default router;
