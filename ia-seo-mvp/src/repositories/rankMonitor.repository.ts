import { DomainCompetitorsTask } from '../models/domainCompetitors.model';
import { SerpTask } from '../models/serpTask.model';
import { Op, where, col } from 'sequelize';

export const DomainCompetitorsRepository = {
    async saveDomainCompetitorsTask(task: any, params?: object) {
        return DomainCompetitorsTask.create({
            id: task.id,
            user_id: task.user_id,
            status_code: task.status_code,
            status_message: task.status_message,
            time: task.time,
            cost: task.cost,
            result_count: task.result_count,
            path: task.path,
            data: task.data,
            result: task.result,
            params: params,
            isReady: true
        });
    },

    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        const tasks = await DomainCompetitorsTask.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            const params = task.params as any;
            const target = params?.target || 'unknown';
            const locationCode = params?.location_code || params?.location_name || 'unknown';
            const languageCode = params?.language_code || params?.language_name || 'unknown';

            // Créer une fenêtre de temps de 5 minutes
            const timeWindow = Math.floor(new Date(task.created_at!).getTime() / (5 * 60 * 1000));

            const groupKey = `${target}_${locationCode}_${languageCode}_${timeWindow}`;

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(task);
        });

        const allGroups = Object.entries(groups).map(([groupKey, tasks]) => {
            const firstTask = tasks[0];
            const params = firstTask.params as any;
            return {
                group_id: groupKey,
                group_params: {
                    target: params?.target,
                    location_code: params?.location_code,
                    location_name: params?.location_name,
                    language_code: params?.language_code,
                    language_name: params?.language_name,
                    limit: params?.limit,
                    item_types: params?.item_types
                },
                created_at: firstTask.created_at,
                tasks_count: tasks.length,
                total_results: tasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
                total_cost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0)
            };
        }).sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());

        // Appliquer la pagination
        const totalGroups = allGroups.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedGroups = allGroups.slice(startIndex, endIndex);

        return {
            groups: paginatedGroups,
            pagination: {
                current_page: page,
                per_page: limit,
                total_items: totalGroups,
                total_pages: Math.ceil(totalGroups / limit),
                has_next_page: page < Math.ceil(totalGroups / limit),
                has_prev_page: page > 1
            }
        };
    },

    async getTaskGroupById(userId: number, groupId: string) {
        // Déconstruire le groupId pour retrouver les critères
        const parts = groupId.split('_');
        if (parts.length < 4) {
            throw new Error('Invalid group ID format');
        }

        const target = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await DomainCompetitorsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                }
            },
            order: [['created_at', 'DESC']]
        });

        // Filtrer par paramètres similaires
        const filteredTasks = tasks.filter(task => {
            const params = task.params as any;
            const taskTarget = params?.target || 'unknown';
            const taskLocationCode = params?.location_code || params?.location_name || 'unknown';
            const taskLanguageCode = params?.language_code || params?.language_name || 'unknown';

            return taskTarget === target &&
                taskLocationCode.toString() === locationCode &&
                taskLanguageCode === languageCode;
        });

        if (filteredTasks.length === 0) {
            throw new Error('Group not found');
        }

        const firstTask = filteredTasks[0];
        const params = firstTask.params as any;

        return {
            group_id: groupId,
            group_params: {
                target: params?.target,
                location_code: params?.location_code,
                location_name: params?.location_name,
                language_code: params?.language_code,
                language_name: params?.language_name,
                limit: params?.limit,
                item_types: params?.item_types
            },
            created_at: firstTask.created_at,
            tasks_count: filteredTasks.length,
            total_results: filteredTasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
            total_cost: filteredTasks.reduce((sum, task) => sum + (task.cost || 0), 0),
            tasks: filteredTasks
        };
    },

    async deleteTaskGroup(userId: number, groupId: string) {
        // Déconstruire le groupId pour retrouver les critères
        const parts = groupId.split('_');
        if (parts.length < 4) {
            throw new Error('Invalid group ID format');
        }

        const target = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await DomainCompetitorsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                }
            }
        });

        // Filtrer par paramètres similaires et récupérer les IDs
        const taskIds = tasks
            .filter(task => {
                const params = task.params as any;
                const taskTarget = params?.target || 'unknown';
                const taskLocationCode = params?.location_code || params?.location_name || 'unknown';
                const taskLanguageCode = params?.language_code || params?.language_name || 'unknown';

                return taskTarget === target &&
                    taskLocationCode.toString() === locationCode &&
                    taskLanguageCode === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            throw new Error('Group not found');
        }

        // Supprimer les tâches
        const deletedCount = await DomainCompetitorsTask.destroy({
            where: {
                id: {
                    [Op.in]: taskIds
                },
                user_id: userId
            }
        });

        return deletedCount;
    }
};

export const SerpTaskRepository = {
    async saveSerpTaskPost(task: any, params?: object) {
        return SerpTask.create({
            id: task.id,
            user_id: task.user_id,
            status_code: task.status_code,
            status_message: task.status_message,
            time: task.time,
            cost: task.cost,
            result_count: task.result_count,
            path: task.path,
            data: task.data,
            result: task.result,
            params: params,
            isReady: false
        });
    },
    async updateSerpTaskReady(task: any) {
        return SerpTask.update(
            {
                isReady: true,
                result: task.result,
                status_code: task.status_code,
                status_message: task.status_message,
                time: task.time,
                cost: task.cost,
                result_count: task.result_count
            },
            { where: { id: task.id } }
        );
    },
};