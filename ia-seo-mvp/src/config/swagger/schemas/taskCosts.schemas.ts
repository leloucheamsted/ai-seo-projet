export const taskCostSchemas = {
    TaskCost: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Task cost ID'
            },
            userId: {
                type: 'integer',
                description: 'User ID'
            },
            taskType: {
                type: 'string',
                description: 'Type of task'
            },
            cost: {
                type: 'number',
                format: 'float',
                description: 'Cost of the task'
            },
            taskDate: {
                type: 'string',
                format: 'date-time',
                description: 'Date when the task was executed'
            },
            details: {
                type: 'object',
                description: 'Additional task details'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
            }
        },
        required: ['userId', 'taskType', 'cost', 'taskDate']
    },
    TaskCostSummary: {
        type: 'object',
        properties: {
            totalCost: {
                type: 'number',
                format: 'float',
                description: 'Total cost amount'
            },
            taskCount: {
                type: 'integer',
                description: 'Number of tasks'
            },
            period: {
                type: 'object',
                properties: {
                    startDate: {
                        type: 'string',
                        format: 'date'
                    },
                    endDate: {
                        type: 'string',
                        format: 'date'
                    }
                }
            }
        }
    },
    TaskCostByType: {
        type: 'object',
        properties: {
            taskType: {
                type: 'string',
                description: 'Type of task'
            },
            totalCost: {
                type: 'number',
                format: 'float',
                description: 'Total cost for this task type'
            },
            taskCount: {
                type: 'integer',
                description: 'Number of tasks of this type'
            },
            averageCost: {
                type: 'number',
                format: 'float',
                description: 'Average cost per task'
            }
        }
    }
};
