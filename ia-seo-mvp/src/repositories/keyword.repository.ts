import { RelatedKeywordsTask } from '../models/relatedKeywords.model';
import { KeywordsForKeywordsTask } from '../models/keywordsForKeywords.model';
import { KeywordsForSiteTask } from '../models/keywordsForSite.model';
import { SerpTask } from '../models/serpTask.model';

export const RelatedKeywordsRepository = {
    async saveTask(task: any) {
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
            result: task.result
        });
    },
};

export const KeywordsForKeywordsRepository = {
    async saveTaskPostKeywordForKeyword(task: any) {
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
            isReady: false
        });
    },
    async saveTaskLiveKeywordForKeyword(task: any) {
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
            isReady: true
        });
    },
    async updateTaskKeywordForKeyword(taskId: string) {
        return KeywordsForKeywordsTask.update(
            { isReady: true },
            { where: { id: taskId } }
        );
    },
    async saveTaskSearchVolume(task: any) {
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
            isReady: true,
            isSearchVolumn: true
        });
    },
};

export const KeywordsForSiteRepository = {
    async savekeywordForSiteTask(task: any) {
        return KeywordsForSiteTask.create({
            id: task.id,
            status_code: task.status_code,
            status_message: task.status_message,
            time: task.time,
            cost: task.cost,
            result_count: task.result_count,
            path: task.path,
            data: task.data,
            result: task.result
        });
    },
};

export const SerpRepository = {
    async saveSerpTask(task: any) {
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
            isReady: true
        });
    },
};
