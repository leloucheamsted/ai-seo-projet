export const urlAnalyzerSchemas = {
    // OnPage Analysis Schemas
    OnPageTaskParams: {
        type: 'object',
        required: ['target'],
        properties: {
            target: {
                type: 'string',
                description: 'Target URL for OnPage analysis',
                example: 'https://example.com',
                format: 'uri',
            },
            max_crawl_pages: {
                type: 'integer',
                description: 'Maximum number of pages to crawl',
                example: 100,
                minimum: 1,
                maximum: 10000,
            },
            max_crawl_depth: {
                type: 'integer',
                description: 'Maximum crawl depth',
                example: 3,
                minimum: 0,
                maximum: 10,
            },
            enable_javascript: {
                type: 'boolean',
                description: 'Whether to enable JavaScript execution',
                example: true,
            },
            enable_content_parsing: {
                type: 'boolean',
                description: 'Whether to enable content parsing',
                example: true,
            },
            is_search_volume: {
                type: 'boolean',
                description: 'Whether to include search volume data',
                example: false,
            },
        },
    },

    OnPageTaskResponse: {
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
                example: 0.1,
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
                            example: 0.1,
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
                            example: ['v3', 'on_page', 'task_post'],
                        },
                        data: {
                            type: 'object',
                            properties: {
                                api: {
                                    type: 'string',
                                    example: 'on_page',
                                },
                                function: {
                                    type: 'string',
                                    example: 'task_post',
                                },
                                target: {
                                    type: 'string',
                                    example: 'https://example.com',
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

    // OnPage Groups Schemas
    OnPageGroupParams: {
        type: 'object',
        properties: {
            target: {
                type: 'string',
                description: 'Target URL for OnPage analysis',
                example: 'https://example.com',
                format: 'uri',
            },
            max_crawl_pages: {
                type: 'integer',
                description: 'Maximum number of pages to crawl',
                example: 100,
                minimum: 1,
                maximum: 10000,
            },
            max_crawl_depth: {
                type: 'integer',
                description: 'Maximum crawl depth',
                example: 3,
                minimum: 0,
                maximum: 10,
            },
            enable_javascript: {
                type: 'boolean',
                description: 'Whether to enable JavaScript execution',
                example: true,
            },
            enable_content_parsing: {
                type: 'boolean',
                description: 'Whether to enable content parsing',
                example: true,
            },
            is_search_volume: {
                type: 'boolean',
                description: 'Whether to include search volume data',
                example: false,
            },
        },
    },

    OnPageGroup: {
        type: 'object',
        properties: {
            group_id: {
                type: 'string',
                description: 'Unique identifier for the OnPage analysis group',
                example: 'https://example.com_100_1234567',
            },
            group_params: {
                $ref: '#/components/schemas/OnPageGroupParams',
                description: 'Parameters used to create this OnPage analysis group',
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Creation time of the first task in group',
                example: '2024-01-15T10:30:00.000Z',
            },
            tasks_count: {
                type: 'integer',
                description: 'Number of OnPage analysis tasks in this group',
                example: 2,
                minimum: 1,
            },
            total_results: {
                type: 'integer',
                description: 'Total result count across all OnPage analysis tasks',
                example: 0,
                minimum: 0,
            },
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost across all OnPage analysis tasks',
                example: 0.2,
                minimum: 0,
            },
        },
        required: ['group_id', 'group_params', 'created_at', 'tasks_count', 'total_results', 'total_cost'],
    },

    OnPageGroupsResponse: {
        type: 'object',
        properties: {
            groups: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/OnPageGroup',
                },
                description: 'Array of OnPage analysis groups',
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
                description: 'Pagination information',
            },
        },
        required: ['groups', 'pagination'],
    },

    // Content Analysis Schemas
    ContentAnalysisParams: {
        type: 'object',
        required: ['target', 'keyword'],
        properties: {
            target: {
                type: 'string',
                description: 'Target URL for content analysis',
                example: 'https://example.com',
                format: 'uri',
            },
            keyword: {
                type: 'string',
                description: 'Target keyword for analysis',
                example: 'SEO optimization',
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
        },
    },

    // Domain Rank Overview Schemas
    DomainRankOverviewParams: {
        type: 'object',
        required: ['target'],
        properties: {
            target: {
                type: 'string',
                description: 'Target domain for rank overview analysis',
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
        },
    },

    DomainRankOverviewGroup: {
        type: 'object',
        properties: {
            group_id: {
                type: 'string',
                description: 'Unique identifier for the domain rank overview group',
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
                description: 'Number of domain rank overview tasks in this group',
                example: 2,
                minimum: 1,
            },
            total_results: {
                type: 'integer',
                description: 'Total result count across all domain rank overview tasks',
                example: 50,
                minimum: 0,
            },
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost across all domain rank overview tasks',
                example: 0.2,
                minimum: 0,
            },
        },
        required: ['group_id', 'group_params', 'created_at', 'tasks_count', 'total_results', 'total_cost'],
    },

    DomainRankOverviewGroupsResponse: {
        type: 'object',
        properties: {
            groups: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/DomainRankOverviewGroup',
                },
                description: 'Array of domain rank overview groups',
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
                description: 'Pagination information',
            },
        },
        required: ['groups', 'pagination'],
    },
};
