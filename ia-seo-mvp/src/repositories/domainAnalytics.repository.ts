import { DomainRankOverviewTask } from '../models/domainRankOverview.model';

export const DomainRankOverviewRepository = {
    async saveDomainRankOverviewTask(task: any, params?: object) {
        return DomainRankOverviewTask.create({
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
