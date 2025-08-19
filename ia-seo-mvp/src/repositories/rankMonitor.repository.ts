import { DomainCompetitorsTask } from '../models/domainCompetitors.model';
import { SerpTask } from '../models/serpTask.model';

export const DomainCompetitorsRepository = {
    async saveDomainCompetitorsTask(task: any, params?: object) {
        return DomainCompetitorsTask.create({
            id: task.id,
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
};

export const SerpTaskRepository = {
    async saveSerpTaskPost(task: any, params?: object) {
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