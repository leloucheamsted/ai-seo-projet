export const rankMonitorPaths = {
    '/api/rank-monitor/serp/task_post': {
        post: {
            tags: ['Rank Monitor'],
            summary: 'Create SERP analysis task',
            description: 'Create a new SERP analysis task for keyword ranking',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/SerpTaskParams',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'SERP analysis task created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/SerpTaskResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Bad request - invalid parameters',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized - invalid token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/rank-monitor/serp/groups': {
        get: {
            tags: ['Rank Monitor'],
            summary: 'Get SERP analysis groups',
            description: 'Get grouped SERP analysis tasks with pagination',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number for pagination',
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        default: 1,
                    },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Number of groups per page',
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                },
            ],
            responses: {
                200: {
                    description: 'SERP analysis groups retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/SerpGroupsResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized - invalid token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/rank-monitor/domain-competitors/groups': {
        get: {
            tags: ['Rank Monitor'],
            summary: 'Get domain competitors groups',
            description: 'Get grouped domain competitors tasks with pagination',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number for pagination',
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        default: 1,
                    },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Number of groups per page',
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        default: 10,
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Domain competitors groups retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DomainCompetitorsGroupsResponse',
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized - invalid token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
};
