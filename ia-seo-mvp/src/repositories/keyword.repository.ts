import { RelatedKeywordsTask } from '../models/relatedKeywords.model';
import { KeywordsForKeywordsTask } from '../models/keywordsForKeywords.model';
import { KeywordsForSiteTask } from '../models/keywordsForSite.model';
import { SerpTask } from '../models/serpTask.model';

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
};

export const KeywordsForKeywordsRepository = {
    async saveTaskPostKeywordForKeyword(task: any, params?: object) {
        return KeywordsForKeywordsTask.create({
            id: task.id,
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
};

export const KeywordsForSiteRepository = {
    async savekeywordForSiteTask(task: any, params?: object) {
        return KeywordsForSiteTask.create({
            id: task.id,
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
};

export const SerpRepository = {
    async saveSerpTask(task: any, params?: object) {
        return SerpTask.create({
            id: task.id,
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
};
