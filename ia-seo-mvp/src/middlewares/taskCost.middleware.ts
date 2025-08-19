import { Request, Response, NextFunction } from 'express';
import { TaskCostService } from '../services/taskCost.service';

interface ExtendedRequest extends Request {
    taskType?: string;
    apiEndpoint?: string;
}

/**
 * Middleware pour intercepter et enregistrer les coûts des tâches DataForSEO
 */
export const taskCostMiddleware = (taskType: string) => {
    return (req: ExtendedRequest, res: Response, next: NextFunction) => {
        // Stocker les informations de la requête
        req.taskType = taskType;
        req.apiEndpoint = req.originalUrl;

        // Intercepter la méthode json de la réponse
        const originalJson = res.json;
        res.json = function (data: any) {
            // Traiter la réponse de manière asynchrone sans bloquer la réponse
            if (req.user?.id && data && typeof data === 'object') {
                setImmediate(async () => {
                    try {
                        const costs = TaskCostService.extractTaskCosts(
                            data,
                            req.user!.id,
                            req.apiEndpoint!,
                            req.taskType!
                        );

                        if (costs.length > 0) {
                            await TaskCostService.recordMultipleTaskCosts(costs);
                            console.log(`Recorded ${costs.length} task costs for user ${req.user!.id}`);
                        }
                    } catch (error) {
                        console.error('Error in taskCostMiddleware:', error);
                        // Ne pas faire échouer la requête si l'enregistrement des coûts échoue
                    }
                });
            }

            // Appeler la méthode json originale
            return originalJson.call(this, data);
        };

        next();
    };
};

/**
 * Types de tâches disponibles
 */
export const TaskTypes = {
    KEYWORDS_FOR_KEYWORDS: 'keywords_for_keywords',
    KEYWORDS_FOR_SITE: 'keywords_for_site',
    RELATED_KEYWORDS: 'related_keywords',
    SEARCH_VOLUME: 'search_volume',
    SERP: 'serp',
    ONPAGE: 'onpage',
    CONTENT_ANALYSIS: 'content_analysis',
    DOMAIN_ANALYTICS: 'domain_analytics',
    DOMAIN_COMPETITORS: 'domain_competitors',
} as const;
