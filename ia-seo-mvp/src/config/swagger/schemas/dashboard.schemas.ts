export const dashboardSchemas = {
    DashboardStats: {
        type: 'object',
        properties: {
            totalCosts: {
                type: 'number',
                format: 'float',
                description: 'Total costs for the user'
            },
            totalTasks: {
                type: 'integer',
                description: 'Total number of tasks executed'
            },
            todayCosts: {
                type: 'number',
                format: 'float',
                description: 'Costs for today'
            },
            thisMonthCosts: {
                type: 'number',
                format: 'float',
                description: 'Costs for this month'
            },
            recentActivity: {
                type: 'array',
                items: { $ref: '#/components/schemas/ActivityItem' },
                description: 'Recent task activity'
            },
            costsByType: {
                type: 'array',
                items: { $ref: '#/components/schemas/CostByType' },
                description: 'Costs breakdown by task type'
            }
        }
    },
    DashboardOverview: {
        type: 'object',
        properties: {
            totalCosts: { type: 'number', format: 'float' },
            totalTasks: { type: 'integer' },
            todayCosts: { type: 'number', format: 'float' },
            activeTasksCount: { type: 'integer' },
            lastActivityDate: { type: 'string', format: 'date-time' }
        }
    },
    TasksByType: {
        type: 'object',
        properties: {
            taskTypes: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        taskType: { type: 'string' },
                        count: { type: 'integer' },
                        percentage: { type: 'number', format: 'float' }
                    }
                }
            },
            totalTasks: { type: 'integer' }
        }
    },
    CostsByType: {
        type: 'object',
        properties: {
            costsByType: {
                type: 'array',
                items: { $ref: '#/components/schemas/CostByType' }
            },
            totalCost: { type: 'number', format: 'float' }
        }
    },
    RecentActivity: {
        type: 'object',
        properties: {
            activities: {
                type: 'array',
                items: { $ref: '#/components/schemas/ActivityItem' }
            },
            count: { type: 'integer' }
        }
    },
    MonthlyTrend: {
        type: 'object',
        properties: {
            months: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        month: { type: 'string' },
                        year: { type: 'integer' },
                        totalCost: { type: 'number', format: 'float' },
                        totalTasks: { type: 'integer' }
                    }
                }
            },
            trend: { type: 'string', enum: ['up', 'down', 'stable'] }
        }
    },
    TopEndpoints: {
        type: 'object',
        properties: {
            endpoints: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        endpoint: { type: 'string' },
                        calls: { type: 'integer' },
                        totalCost: { type: 'number', format: 'float' },
                        averageCost: { type: 'number', format: 'float' }
                    }
                }
            },
            totalEndpoints: { type: 'integer' }
        }
    },
    CachedStats: {
        type: 'object',
        properties: {
            data: { $ref: '#/components/schemas/DashboardStats' },
            cacheTime: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date-time' }
        }
    },
    ActivityItem: {
        type: 'object',
        properties: {
            taskType: { type: 'string', description: 'Type of task' },
            cost: { type: 'number', format: 'float', description: 'Task cost' },
            timestamp: { type: 'string', format: 'date-time', description: 'When the task was executed' },
            status: { type: 'string', description: 'Task status' },
            endpoint: { type: 'string', description: 'API endpoint called' }
        }
    },
    CostByType: {
        type: 'object',
        properties: {
            taskType: { type: 'string' },
            totalCost: { type: 'number', format: 'float' },
            count: { type: 'integer' },
            averageCost: { type: 'number', format: 'float' }
        }
    },
    DashboardSummary: {
        type: 'object',
        properties: {
            totalCosts: {
                type: 'number',
                format: 'float',
                description: 'Total costs for the user'
            },
            totalTasks: {
                type: 'integer',
                description: 'Total number of tasks executed'
            },
            todayCosts: {
                type: 'number',
                format: 'float',
                description: 'Costs for today'
            },
            thisMonthCosts: {
                type: 'number',
                format: 'float',
                description: 'Costs for this month'
            },
            recentActivity: {
                type: 'array',
                items: { $ref: '#/components/schemas/ActivityItem' },
                description: 'Recent task activity'
            },
            costsByType: {
                type: 'array',
                items: { $ref: '#/components/schemas/CostByType' },
                description: 'Costs breakdown by task type'
            }
        }
    }
};
