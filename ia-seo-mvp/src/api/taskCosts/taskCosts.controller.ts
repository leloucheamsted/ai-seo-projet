import { Request, Response } from 'express';
import { TaskCostService } from '../../services/taskCost.service';

/**
 * @swagger
 * /api/task-costs/user-total:
 *   get:
 *     summary: Get user total costs
 *     tags:
 *       - Task Costs
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for cost calculation
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for cost calculation
 *     responses:
 *       200:
 *         description: User total costs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCost:
 *                   type: number
 *                 userId:
 *                   type: number
 */
export const getUserTotalCost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { startDate, endDate } = req.query;

        let start: Date | undefined;
        let end: Date | undefined;

        if (startDate && typeof startDate === 'string') {
            start = new Date(startDate);
        }

        if (endDate && typeof endDate === 'string') {
            end = new Date(endDate);
        }

        const totalCost = await TaskCostService.getUserTotalCost(userId, start, end);

        res.json({
            totalCost,
            userId,
            startDate: start,
            endDate: end,
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/task-costs/user-by-type:
 *   get:
 *     summary: Get user costs by task type
 *     tags:
 *       - Task Costs
 *     responses:
 *       200:
 *         description: User costs by task type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 costsByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       task_type:
 *                         type: string
 *                       total_cost:
 *                         type: number
 *                 userId:
 *                   type: number
 */
export const getUserCostsByTaskType = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const costsByType = await TaskCostService.getUserCostsByTaskType(userId);

        res.json({
            costsByType,
            userId,
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/task-costs/user-today:
 *   get:
 *     summary: Get user costs for today
 *     tags:
 *       - Task Costs
 *     responses:
 *       200:
 *         description: User costs for today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayCost:
 *                   type: number
 *                 userId:
 *                   type: number
 *                 date:
 *                   type: string
 *                   format: date
 */
export const getUserTodayCost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const todayCost = await TaskCostService.getUserTodayCost(userId);
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

        res.json({
            todayCost,
            userId,
            date: today,
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
