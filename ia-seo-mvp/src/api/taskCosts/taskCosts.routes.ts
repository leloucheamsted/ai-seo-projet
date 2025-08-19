import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getUserTotalCost, getUserCostsByTaskType, getUserTodayCost } from './taskCosts.controller';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes pour les coûts des tâches
router.get('/user-total', getUserTotalCost);
router.get('/user-by-type', getUserCostsByTaskType);
router.get('/user-today', getUserTodayCost);

export default router;
