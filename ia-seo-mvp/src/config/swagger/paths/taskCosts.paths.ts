export const taskCostsPaths = {
    '/api/task-costs/user-total': {
        get: {
            summary: 'Get user total costs',
            tags: ['Task Costs'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'query',
                    name: 'startDate',
                    schema: {
                        type: 'string',
                        format: 'date'
                    },
                    description: 'Start date for cost calculation'
                },
                {
                    in: 'query',
                    name: 'endDate',
                    schema: {
                        type: 'string',
                        format: 'date'
                    },
                    description: 'End date for cost calculation'
                }
            ],
            responses: {
                200: {
                    description: 'User total costs retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    totalCost: { type: 'number' },
                                    userId: { type: 'integer' },
                                    startDate: { type: 'string', format: 'date' },
                                    endDate: { type: 'string', format: 'date' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    },
    '/api/task-costs/user-by-type': {
        get: {
            summary: 'Get user costs by task type',
            tags: ['Task Costs'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User costs by task type retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    costsByType: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                taskType: { type: 'string' },
                                                totalCost: { type: 'number' },
                                                taskCount: { type: 'integer' }
                                            }
                                        }
                                    },
                                    userId: { type: 'integer' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    },
    '/api/task-costs/user-today': {
        get: {
            summary: 'Get user costs for today',
            tags: ['Task Costs'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User today costs retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    todayCost: { type: 'number' },
                                    userId: { type: 'integer' },
                                    date: { type: 'string', format: 'date' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    }
};
