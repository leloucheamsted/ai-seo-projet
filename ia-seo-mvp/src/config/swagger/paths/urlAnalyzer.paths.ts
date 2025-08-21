export const urlAnalyzerPaths = {
    '/api/url-analyzer/onpage/task_post': {
        post: {
            tags: ['URL Analyzer'],
            summary: 'Create OnPage analysis task',
            description: 'Create a new OnPage analysis task for a target URL',
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
                            $ref: '#/components/schemas/OnPageTaskParams',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'OnPage analysis task created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/OnPageTaskResponse',
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
    '/api/url-analyzer/onpage/groups': {
        get: {
            tags: ['URL Analyzer'],
            summary: 'Get OnPage analysis groups',
            description: 'Get grouped OnPage analysis tasks with pagination',
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
                    description: 'OnPage analysis groups retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/OnPageGroupsResponse',
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
    '/api/url-analyzer/onpage/groups/{id}': {
        get: {
            tags: ['URL Analyzer'],
            summary: 'Get OnPage analysis group by ID',
            description: 'Get detailed information about a specific OnPage analysis group',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Group ID',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OnPage analysis group retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/OnPageGroup',
                            },
                        },
                    },
                },
                404: {
                    description: 'Group not found',
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
        delete: {
            tags: ['URL Analyzer'],
            summary: 'Delete OnPage analysis group',
            description: 'Delete a specific OnPage analysis group and all its tasks',
            security: [
                {
                    bearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Group ID',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'OnPage analysis group deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/SuccessResponse',
                            },
                        },
                    },
                },
                404: {
                    description: 'Group not found',
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
    '/api/url-analyzer/domain-rank-overview/groups': {
        get: {
            tags: ['URL Analyzer'],
            summary: 'Get domain rank overview groups',
            description: 'Get grouped domain rank overview tasks with pagination',
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
                    description: 'Domain rank overview groups retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DomainRankOverviewGroupsResponse',
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
