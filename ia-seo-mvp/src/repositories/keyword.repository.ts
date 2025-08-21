import { RelatedKeywordsTask } from '../models/relatedKeywords.model';
import { KeywordsForKeywordsTask } from '../models/keywordsForKeywords.model';
import { KeywordsForSiteTask } from '../models/keywordsForSite.model';
import { SerpTask } from '../models/serpTask.model';
import { Op, where, col } from 'sequelize';

export const RelatedKeywordsRepository = {
    async saveTask(task: any, params?: object) {
        return RelatedKeywordsTask.create({
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
            params: params || {},
            isReady: true
        });
    },

    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        const tasks = await RelatedKeywordsTask.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            // Créer une clé de groupe basée sur les paramètres principaux
            const params = task.params as any;
            const createdAt = new Date(task.created_at!);
            const timeWindow = Math.floor(createdAt.getTime() / (5 * 60 * 1000)); // Fenêtre de 5 minutes

            const groupKey = `${params?.keyword || 'unknown'}_${params?.location_code || 'default'}_${params?.language_code || 'en'}_${timeWindow}`;

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
                    keyword: params?.keyword,
                    location_code: params?.location_code,
                    language_code: params?.language_code,
                    limit: params?.limit
                },
                created_at: firstTask.created_at,
                tasks_count: tasks.length,
                total_results: tasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
                total_cost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0),
                tasks: tasks.map(task => ({
                    id: task.id,
                    status_code: task.status_code,
                    status_message: task.status_message,
                    time: task.time,
                    cost: task.cost,
                    result_count: task.result_count,
                    result: task.result
                }))
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

        const keyword = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await RelatedKeywordsTask.findAll({
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
            return params?.keyword === keyword &&
                params?.location_code?.toString() === locationCode &&
                params?.language_code === languageCode;
        });

        if (filteredTasks.length === 0) {
            return null;
        }

        const firstTask = filteredTasks[0];
        const params = firstTask.params as any;

        return {
            group_id: groupId,
            group_params: {
                keyword: params?.keyword,
                location_code: params?.location_code,
                language_code: params?.language_code,
                limit: params?.limit
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

        const keyword = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await RelatedKeywordsTask.findAll({
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
                return params?.keyword === keyword &&
                    params?.location_code?.toString() === locationCode &&
                    params?.language_code === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            return 0;
        }

        // Supprimer les tâches
        const deletedCount = await RelatedKeywordsTask.destroy({
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

export const KeywordsForKeywordsRepository = {
    async saveTaskPostKeywordForKeyword(task: any, params?: object) {
        return KeywordsForKeywordsTask.create({
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
            params: params || {},
            isReady: false
        });
    },
    async saveTaskLiveKeywordForKeyword(task: any, params?: object) {
        return KeywordsForKeywordsTask.create({
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
            params: params || {},
            isReady: true
        });
    },
    async updateTaskKeywordForKeyword(taskId: string) {
        return KeywordsForKeywordsTask.update(
            { isReady: true },
            { where: { id: taskId } }
        );
    },
    async saveTaskSearchVolume(task: any, params?: object) {
        return KeywordsForKeywordsTask.create({
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
            params: params || {},
            isReady: true,
            isSearchVolumn: true
        });
    },

    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        // Récupérer seulement les tâches où isSearchVolumn = false ou null
        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                [Op.or]: [
                    { isSearchVolumn: false },
                    where(col('isSearchVolumn'), 'IS', null)
                ]
            },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            // Créer une clé de groupe basée sur les paramètres principaux
            const params = task.params as any;
            const createdAt = new Date(task.created_at!);
            const timeWindow = Math.floor(createdAt.getTime() / (5 * 60 * 1000)); // Fenêtre de 5 minutes

            // Créer une clé basée sur les keywords (tableau transformé en string)
            const keywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
            const groupKey = `${keywordsKey}_${params?.location_code || 'default'}_${params?.language_code || 'en'}_${timeWindow}`;

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
                    keywords: params?.keywords,
                    location_code: params?.location_code,
                    language_code: params?.language_code,
                    target: params?.target
                },
                created_at: firstTask.created_at,
                tasks_count: tasks.length,
                total_results: tasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
                total_cost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0),
                tasks: tasks.map(task => ({
                    id: task.id,
                    status_code: task.status_code,
                    status_message: task.status_message,
                    time: task.time,
                    cost: task.cost,
                    result_count: task.result_count,
                    isReady: task.isReady,
                    result: task.result
                }))
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

        const keywordsKey = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                },
                [Op.or]: [
                    { isSearchVolumn: false },
                    where(col('isSearchVolumn'), 'IS', null)
                ]
            },
            order: [['created_at', 'DESC']]
        });

        // Filtrer par paramètres similaires
        const filteredTasks = tasks.filter(task => {
            const params = task.params as any;
            const taskKeywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
            return taskKeywordsKey === keywordsKey &&
                params?.location_code?.toString() === locationCode &&
                params?.language_code === languageCode;
        });

        if (filteredTasks.length === 0) {
            return null;
        }

        const firstTask = filteredTasks[0];
        const params = firstTask.params as any;

        return {
            group_id: groupId,
            group_params: {
                keywords: params?.keywords,
                location_code: params?.location_code,
                language_code: params?.language_code,
                target: params?.target
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

        const keywordsKey = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                },
                [Op.or]: [
                    { isSearchVolumn: false },
                    where(col('isSearchVolumn'), 'IS', null)
                ]
            }
        });

        // Filtrer par paramètres similaires et récupérer les IDs
        const taskIds = tasks
            .filter(task => {
                const params = task.params as any;
                const taskKeywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
                return taskKeywordsKey === keywordsKey &&
                    params?.location_code?.toString() === locationCode &&
                    params?.language_code === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            return 0;
        }

        // Supprimer les tâches
        const deletedCount = await KeywordsForKeywordsTask.destroy({
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

export const KeywordsForSiteRepository = {
    async savekeywordForSiteTask(task: any, params?: object) {
        return KeywordsForSiteTask.create({
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
            params: params || {},
            isReady: true
        });
    },

    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        const tasks = await KeywordsForSiteTask.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            // Créer une clé de groupe basée sur les paramètres principaux
            const params = task.params as any;
            const createdAt = new Date(task.created_at!);
            const timeWindow = Math.floor(createdAt.getTime() / (5 * 60 * 1000)); // Fenêtre de 5 minutes

            const groupKey = `${params?.target || 'unknown'}_${params?.target_type || 'domain'}_${params?.location_code || 'default'}_${params?.language_code || 'en'}_${timeWindow}`;

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
                    target_type: params?.target_type,
                    location_code: params?.location_code,
                    language_code: params?.language_code,
                    include_adult_keywords: params?.include_adult_keywords,
                    sort_by: params?.sort_by
                },
                created_at: firstTask.created_at,
                tasks_count: tasks.length,
                total_results: tasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
                total_cost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0),
                tasks: tasks.map(task => ({
                    id: task.id,
                    status_code: task.status_code,
                    status_message: task.status_message,
                    time: task.time,
                    cost: task.cost,
                    result_count: task.result_count,
                    isReady: task.isReady,
                    result: task.result
                }))
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
        if (parts.length < 5) {
            throw new Error('Invalid group ID format');
        }

        const target = parts.slice(0, -4).join('_');
        const targetType = parts[parts.length - 4];
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForSiteTask.findAll({
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
            return params?.target === target &&
                params?.target_type === targetType &&
                params?.location_code?.toString() === locationCode &&
                params?.language_code === languageCode;
        });

        if (filteredTasks.length === 0) {
            return null;
        }

        const firstTask = filteredTasks[0];
        const params = firstTask.params as any;

        return {
            group_id: groupId,
            group_params: {
                target: params?.target,
                target_type: params?.target_type,
                location_code: params?.location_code,
                language_code: params?.language_code,
                include_adult_keywords: params?.include_adult_keywords,
                sort_by: params?.sort_by
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
        if (parts.length < 5) {
            throw new Error('Invalid group ID format');
        }

        const target = parts.slice(0, -4).join('_');
        const targetType = parts[parts.length - 4];
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForSiteTask.findAll({
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
                return params?.target === target &&
                    params?.target_type === targetType &&
                    params?.location_code?.toString() === locationCode &&
                    params?.language_code === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            return 0;
        }

        // Supprimer les tâches
        const deletedCount = await KeywordsForSiteTask.destroy({
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

export const SerpRepository = {
    async saveSerpTask(task: any, params?: object) {
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
            isReady: true,
            params: params || {},
        });
    },

    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        const tasks = await SerpTask.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            const params = task.params as any;
            const keyword = Array.isArray(params?.keywords) && params.keywords.length > 0 ? params.keywords[0] : 'unknown';
            const locationCode = params?.location_code || params?.location_name || 'unknown';
            const languageCode = params?.language_code || 'unknown';

            // Créer une fenêtre de temps de 5 minutes
            const timeWindow = Math.floor(new Date(task.created_at!).getTime() / (5 * 60 * 1000));

            const groupKey = `${keyword}_${locationCode}_${languageCode}_${timeWindow}`;

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
                    keywords: params?.keywords || [],
                    location_code: params?.location_code,
                    location_name: params?.location_name,
                    language_code: params?.language_code,
                    device: params?.device,
                    depth: params?.depth
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

        const keyword = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await SerpTask.findAll({
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
            const taskKeyword = Array.isArray(params?.keywords) && params.keywords.length > 0 ? params.keywords[0] : 'unknown';
            const taskLocationCode = params?.location_code || params?.location_name || 'unknown';
            const taskLanguageCode = params?.language_code || 'unknown';

            return taskKeyword === keyword &&
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
                keywords: params?.keywords || [],
                location_code: params?.location_code,
                location_name: params?.location_name,
                language_code: params?.language_code,
                device: params?.device,
                depth: params?.depth
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

        const keyword = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await SerpTask.findAll({
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
                const taskKeyword = Array.isArray(params?.keywords) && params.keywords.length > 0 ? params.keywords[0] : 'unknown';
                const taskLocationCode = params?.location_code || params?.location_name || 'unknown';
                const taskLanguageCode = params?.language_code || 'unknown';

                return taskKeyword === keyword &&
                    taskLocationCode.toString() === locationCode &&
                    taskLanguageCode === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            throw new Error('Group not found');
        }

        // Supprimer les tâches
        const deletedCount = await SerpTask.destroy({
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

export const SearchVolumeRepository = {
    async getTasksByGroups(userId: number, page: number = 1, limit: number = 10) {
        // Récupérer seulement les tâches où isSearchVolumn = true
        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                isSearchVolumn: true
            },
            order: [['created_at', 'DESC']],
            raw: false
        });

        // Grouper les tâches par similarité (même params et created_at proche)
        const groups: { [key: string]: any[] } = {};

        tasks.forEach(task => {
            // Créer une clé de groupe basée sur les paramètres principaux
            const params = task.params as any;
            const createdAt = new Date(task.created_at!);
            const timeWindow = Math.floor(createdAt.getTime() / (5 * 60 * 1000)); // Fenêtre de 5 minutes

            // Créer une clé basée sur les keywords (tableau transformé en string)
            const keywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
            const groupKey = `${keywordsKey}_${params?.location_code || 'default'}_${params?.language_code || 'en'}_${timeWindow}`;

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
                    keywords: params?.keywords,
                    location_code: params?.location_code,
                    language_code: params?.language_code,
                    search_partners: params?.search_partners,
                    date_from: params?.date_from,
                    date_to: params?.date_to
                },
                created_at: firstTask.created_at,
                tasks_count: tasks.length,
                total_results: tasks.reduce((sum, task) => sum + (task.result_count || 0), 0),
                total_cost: tasks.reduce((sum, task) => sum + (task.cost || 0), 0),
                tasks: tasks.map(task => ({
                    id: task.id,
                    status_code: task.status_code,
                    status_message: task.status_message,
                    time: task.time,
                    cost: task.cost,
                    result_count: task.result_count,
                    isReady: task.isReady,
                    result: task.result
                }))
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

        const keywordsKey = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                },
                isSearchVolumn: true
            },
            order: [['created_at', 'DESC']]
        });

        // Filtrer par paramètres similaires
        const filteredTasks = tasks.filter(task => {
            const params = task.params as any;
            const taskKeywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
            return taskKeywordsKey === keywordsKey &&
                params?.location_code?.toString() === locationCode &&
                params?.language_code === languageCode;
        });

        if (filteredTasks.length === 0) {
            return null;
        }

        const firstTask = filteredTasks[0];
        const params = firstTask.params as any;

        return {
            group_id: groupId,
            group_params: {
                keywords: params?.keywords,
                location_code: params?.location_code,
                language_code: params?.language_code,
                search_partners: params?.search_partners,
                date_from: params?.date_from,
                date_to: params?.date_to
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

        const keywordsKey = parts.slice(0, -3).join('_');
        const locationCode = parts[parts.length - 3];
        const languageCode = parts[parts.length - 2];
        const timeWindow = parseInt(parts[parts.length - 1]);

        // Calculer la plage de temps
        const startTime = new Date(timeWindow * 5 * 60 * 1000);
        const endTime = new Date((timeWindow + 1) * 5 * 60 * 1000);

        const tasks = await KeywordsForKeywordsTask.findAll({
            where: {
                user_id: userId,
                created_at: {
                    [Op.between]: [startTime, endTime]
                },
                isSearchVolumn: true
            }
        });

        // Filtrer par paramètres similaires et récupérer les IDs
        const taskIds = tasks
            .filter(task => {
                const params = task.params as any;
                const taskKeywordsKey = Array.isArray(params?.keywords) ? params.keywords.sort().join('|') : 'unknown';
                return taskKeywordsKey === keywordsKey &&
                    params?.location_code?.toString() === locationCode &&
                    params?.language_code === languageCode;
            })
            .map(task => task.id);

        if (taskIds.length === 0) {
            return 0;
        }

        // Supprimer les tâches
        const deletedCount = await KeywordsForKeywordsTask.destroy({
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
