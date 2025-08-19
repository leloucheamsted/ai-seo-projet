import { TaskCost } from '../models/taskCost.model';

export interface TaskCostData {
    user_id: number;
    task_id: string;
    task_type: string;
    cost: number;
    api_endpoint: string;
    status_code: number;
}

export class TaskCostService {
    /**
     * Enregistre le coût d'une tâche
     */
    static async recordTaskCost(data: TaskCostData): Promise<TaskCost> {
        try {
            return await TaskCost.create({
                user_id: data.user_id,
                task_id: data.task_id,
                task_type: data.task_type,
                cost: data.cost,
                api_endpoint: data.api_endpoint,
                status_code: data.status_code,
            });
        } catch (error) {
            console.error('Error recording task cost:', error);
            throw error;
        }
    }

    /**
     * Extrait les coûts des tâches depuis la réponse DataForSEO
     */
    static extractTaskCosts(responseData: any, userId: number, endpoint: string, taskType: string): TaskCostData[] {
        const costs: TaskCostData[] = [];

        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                if (task.id && typeof task.cost === 'number' && typeof task.status_code === 'number') {
                    costs.push({
                        user_id: userId,
                        task_id: task.id,
                        task_type: taskType,
                        cost: task.cost,
                        api_endpoint: endpoint,
                        status_code: task.status_code,
                    });
                }
            }
        }

        return costs;
    }

    /**
     * Enregistre les coûts de plusieurs tâches
     */
    static async recordMultipleTaskCosts(costsData: TaskCostData[]): Promise<TaskCost[]> {
        try {
            const results: TaskCost[] = [];
            for (const costData of costsData) {
                const result = await this.recordTaskCost(costData);
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error recording multiple task costs:', error);
            throw error;
        }
    }

    /**
     * Obtient le total des coûts pour un utilisateur
     */
    static async getUserTotalCost(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
        try {
            const whereClause: any = { user_id: userId };

            if (startDate && endDate) {
                whereClause.created_at = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }

            const result = await TaskCost.sum('cost', { where: whereClause });
            return result || 0;
        } catch (error) {
            console.error('Error getting user total cost:', error);
            throw error;
        }
    }

    /**
     * Obtient les coûts par type de tâche pour un utilisateur
     */
    static async getUserCostsByTaskType(userId: number): Promise<Array<{ task_type: string, total_cost: number }>> {
        try {
            const results = await TaskCost.findAll({
                attributes: [
                    'task_type',
                    [TaskCost.sequelize!.fn('SUM', TaskCost.sequelize!.col('cost')), 'total_cost']
                ],
                where: { user_id: userId },
                group: ['task_type'],
                raw: true,
            });

            return results as unknown as Array<{ task_type: string, total_cost: number }>;
        } catch (error) {
            console.error('Error getting user costs by task type:', error);
            throw error;
        }
    }

    /**
     * Obtient le total des coûts pour un utilisateur pour le jour actuel
     */
    static async getUserTodayCost(userId: number): Promise<number> {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

            const result = await TaskCost.sum('cost', {
                where: {
                    user_id: userId,
                    created_at: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    }
                }
            });

            return result || 0;
        } catch (error) {
            console.error('Error getting user today cost:', error);
            throw error;
        }
    }
}
