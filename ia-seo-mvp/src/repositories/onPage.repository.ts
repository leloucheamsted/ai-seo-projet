import { OnPageTask } from '../models/onPageTask.model';

export const OnPageRepository = {
    async saveOnPageTask(task: any, params?: object) {
        return OnPageTask.create({
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

    async updateOnPageTaskReady(taskId: string) {
        return OnPageTask.update(
            { isReady: true },
            { where: { id: taskId } }
        );
    },

    async updateOnPageTaskWithResult(taskId: string, result: any) {
        return OnPageTask.update(
            {
                isReady: true,
                result: result
            },
            { where: { id: taskId } }
        );
    },
};
