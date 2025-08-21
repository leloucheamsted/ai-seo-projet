export const rankMonitorSchemas = {
    // SERP Schemas
    SerpTaskParams: {
        type: 'object',
        required: ['keyword'],
        properties: {
            keyword: {
                type: 'string',
                description: 'Target keyword for SERP analysis',
                example: 'SEO tools',
            },
            location_name: {
                type: 'string',
                description: 'Location name for search',
                example: 'United States',
            },
            location_code: {
                type: 'integer',
                description: 'Location code for search',
                example: 2840,
            },
            language_name: {
                type: 'string',
                description: 'Language name for search',
                example: 'English',
            },
            language_code: {
                type: 'string',
                description: 'Language code for search',
                example: 'en',
            },
            device: {
                type: 'string',
                description: 'Device type for search',
                enum: ['desktop', 'mobile'],
                example: 'desktop',
            },
            os: {
                type: 'string',
                description: 'Operating system',
                example: 'windows',
            },
            depth: {
                type: 'integer',
                description: 'Number of results to return',
                minimum: 1,
                maximum: 700,
                example: 100,
            },
        },
    },

    SerpTaskResponse: {
        type: 'object',
        properties: {
            version: {
                type: 'string',
                example: '0.1.20240801',
            },
            status_code: {
                type: 'integer',
                example: 20100,
            },
            status_message: {
                type: 'string',
                example: 'Task Created.',
            },
            time: {
                type: 'string',
                format: 'date-time',
            },
            cost: {
                type: 'number',
                format: 'float',
                example: 0.002,
            },
            tasks_count: {
                type: 'integer',
                example: 1,
            },
            tasks_error: {
                type: 'integer',
                example: 0,
            },
            tasks: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'task_12345678-1234-1234-1234-123456789012',
                        },
                        status_code: {
                            type: 'integer',
                            example: 20100,
                        },
                        status_message: {
                            type: 'string',
                            example: 'Task Created.',
                        },
                        time: {
                            type: 'string',
                            example: '2024-01-15 10:30:15 +00:00',
                        },
                        cost: {
                            type: 'number',
                            format: 'float',
                            example: 0.002,
                        },
                        result_count: {
                            type: 'integer',
                            example: 0,
                        },
                        path: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['v3', 'serp', 'google', 'organic', 'task_post'],
                        },
                        data: {
                            type: 'object',
                            properties: {
                                api: {
                                    type: 'string',
                                    example: 'serp',
                                },
                                function: {
                                    type: 'string',
                                    example: 'task_post',
                                },
                                keyword: {
                                    type: 'string',
                                    example: 'SEO tools',
                                },
                            },
                        },
                        result: {
                            type: 'array',
                            items: {
                                type: 'object',
                            },
                            nullable: true,
                        },
                    },
                },
            },
        },
    },

    // SERP Groups Schemas
    SerpGroupParams: {
        type: 'object',
        properties: {
            keyword: {
                type: 'string',
                description: 'Keyword used in the group',
                example: 'SEO tools',
            },
            location_code: {
                type: 'integer',
                description: 'Location code used in the group',
                example: 2840,
            },
            language_code: {
                type: 'string',
                description: 'Language code used in the group',
                example: 'en',
            },
            device: {
                type: 'string',
                description: 'Device type used in the group',
                example: 'desktop',
            },
            depth: {
                type: 'integer',
                description: 'Number of results requested',
                example: 100,
            },
        },
    },

    SerpGroup: {
        type: 'object',
        properties: {
            group_id: {
                type: 'string',
                description: 'Unique identifier for the SERP group',
                example: 'SEO tools_2840_en_desktop_100_1234567',
            },
            group_params: {
                $ref: '#/components/schemas/SerpGroupParams',
                description: 'Parameters used to create this SERP group',
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Creation time of the first task in group',
                example: '2024-01-15T10:30:00.000Z',
            },
            tasks_count: {
                type: 'integer',
                description: 'Number of SERP tasks in this group',
                example: 3,
                minimum: 1,
            },
            total_results: {
                type: 'integer',
                description: 'Total result count across all SERP tasks',
                example: 300,
                minimum: 0,
            },
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost across all SERP tasks',
                example: 0.006,
                minimum: 0,
            },
        },
        required: ['group_id', 'group_params', 'created_at', 'tasks_count', 'total_results', 'total_cost'],
    },

    SerpGroupsResponse: {
        type: 'object',
        properties: {
            groups: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/SerpGroup',
                },
                description: 'Array of SERP groups',
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
                description: 'Pagination information',
            },
        },
        required: ['groups', 'pagination'],
    },

    // Domain Competitors Schemas
    DomainCompetitorsParams: {
        type: 'object',
        required: ['target'],
        properties: {
            target: {
                type: 'string',
                description: 'Target domain for competitors analysis',
                example: 'example.com',
            },
            location_name: {
                type: 'string',
                description: 'Location name for analysis',
                example: 'United States',
            },
            location_code: {
                type: 'integer',
                description: 'Location code for analysis',
                example: 2840,
            },
            language_name: {
                type: 'string',
                description: 'Language name for analysis',
                example: 'English',
            },
            language_code: {
                type: 'string',
                description: 'Language code for analysis',
                example: 'en',
            },
            item_types: {
                type: 'array',
                items: {
                    type: 'string',
                },
                description: 'Types of items to include in analysis',
                example: ['organic', 'paid'],
            },
            limit: {
                type: 'integer',
                description: 'Maximum number of results',
                minimum: 1,
                maximum: 1000,
                example: 50,
            },
            filters: {
                type: 'array',
                description: 'Filter conditions for results',
                items: {
                    type: 'object',
                },
            },
            order_by: {
                type: 'array',
                description: 'Order conditions for results',
                items: {
                    type: 'object',
                },
            },
        },
    },

    DomainCompetitorsGroup: {
        type: 'object',
        properties: {
            group_id: {
                type: 'string',
                description: 'Unique identifier for the domain competitors group',
                example: 'example.com_2840_en_1234567',
            },
            group_params: {
                type: 'object',
                properties: {
                    target: {
                        type: 'string',
                        example: 'example.com',
                    },
                    location_code: {
                        type: 'integer',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        example: 'en',
                    },
                    limit: {
                        type: 'integer',
                        example: 50,
                    },
                },
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Creation time of the first task in group',
                example: '2024-01-15T10:30:00.000Z',
            },
            tasks_count: {
                type: 'integer',
                description: 'Number of domain competitors tasks in this group',
                example: 2,
                minimum: 1,
            },
            total_results: {
                type: 'integer',
                description: 'Total result count across all domain competitors tasks',
                example: 100,
                minimum: 0,
            },
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost across all domain competitors tasks',
                example: 0.04,
                minimum: 0,
            },
        },
        required: ['group_id', 'group_params', 'created_at', 'tasks_count', 'total_results', 'total_cost'],
    },

    DomainCompetitorsGroupsResponse: {
        type: 'object',
        properties: {
            groups: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/DomainCompetitorsGroup',
                },
                description: 'Array of domain competitors groups',
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
                description: 'Pagination information',
            },
        },
        required: ['groups', 'pagination'],
    },
};
