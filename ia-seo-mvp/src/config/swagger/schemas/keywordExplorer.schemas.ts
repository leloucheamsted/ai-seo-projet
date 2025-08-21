export const keywordExplorerSchemas = {
    // Related Keywords Schemas
    RelatedKeywordsParams: {
        type: 'object',
        required: ['keyword'],
        properties: {
            keyword: {
                type: 'string',
                description: 'Target keyword for related keywords analysis',
                example: 'SEO tools',
            },
            location_name: {
                type: 'string',
                description: 'Location name for search',
                example: 'United States',
            },
            location_code: {
                type: 'string',
                description: 'Location code for search',
                example: '2840',
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
            depth: {
                type: 'integer',
                description: 'Depth of related keywords analysis',
                minimum: 1,
                maximum: 3,
                example: 2,
            },
            include_seed_keyword: {
                type: 'boolean',
                description: 'Include seed keyword in results',
                example: false,
            },
            include_serp_info: {
                type: 'boolean',
                description: 'Include SERP information',
                example: true,
            },
            include_clickstream_data: {
                type: 'boolean',
                description: 'Include clickstream data',
                example: false,
            },
            ignore_synonyms: {
                type: 'boolean',
                description: 'Ignore synonyms in analysis',
                example: false,
            },
            replace_with_core_keyword: {
                type: 'boolean',
                description: 'Replace with core keyword',
                example: false,
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
            limit: {
                type: 'integer',
                description: 'Maximum number of results',
                minimum: 1,
                maximum: 1000,
                example: 100,
            },
            offset: {
                type: 'integer',
                description: 'Offset for pagination',
                minimum: 0,
                example: 0,
            },
            tag: {
                type: 'string',
                description: 'Tag for the request',
                example: 'related-keywords-analysis',
            },
        },
    },

    // Task Costs Schemas
    TaskCostSummary: {
        type: 'object',
        properties: {
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost of all tasks',
                example: 125.50,
            },
            total_tasks: {
                type: 'integer',
                description: 'Total number of tasks',
                example: 45,
            },
            average_cost: {
                type: 'number',
                format: 'float',
                description: 'Average cost per task',
                example: 2.79,
            },
        },
    },

    TaskCostItem: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Task ID',
                example: 'task_12345678-1234-1234-1234-123456789012',
            },
            api_endpoint: {
                type: 'string',
                description: 'API endpoint used',
                example: 'related_keywords/live',
            },
            cost: {
                type: 'number',
                format: 'float',
                description: 'Task cost',
                example: 0.105,
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Task creation time',
            },
        },
    },

    TaskCostResponse: {
        type: 'object',
        properties: {
            summary: {
                $ref: '#/components/schemas/TaskCostSummary',
            },
            costs: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/TaskCostItem',
                },
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
            },
        },
    },

    // Related Keywords Groups Schemas
    RelatedKeywordsGroup: {
        type: 'object',
        properties: {
            group_id: {
                type: 'string',
                description: 'Unique identifier for the related keywords group',
                example: 'SEO tools_2840_en_1234567',
            },
            group_params: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        example: 'SEO tools',
                    },
                    location_code: {
                        type: 'integer',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        example: 'en',
                    },
                    depth: {
                        type: 'integer',
                        example: 2,
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
                description: 'Number of related keywords tasks in this group',
                example: 3,
                minimum: 1,
            },
            total_results: {
                type: 'integer',
                description: 'Total result count across all related keywords tasks',
                example: 150,
                minimum: 0,
            },
            total_cost: {
                type: 'number',
                format: 'float',
                description: 'Total cost across all related keywords tasks',
                example: 0.315,
                minimum: 0,
            },
        },
    },

    RelatedKeywordsGroupsResponse: {
        type: 'object',
        properties: {
            groups: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/RelatedKeywordsGroup',
                },
                description: 'Array of related keywords groups',
            },
            pagination: {
                $ref: '#/components/schemas/PaginationInfo',
                description: 'Pagination information',
            },
        },
        required: ['groups', 'pagination'],
    },

    // Keywords For Keywords Schemas
    KeywordsForKeywordsParams: {
        type: 'object',
        required: ['keywords'],
        properties: {
            keywords: {
                type: 'array',
                items: {
                    type: 'string',
                },
                description: 'Array of keywords to analyze',
                example: ['SEO', 'keyword research', 'search optimization'],
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
        },
    },

    KeywordsForKeywordsResponse: {
        type: 'object',
        properties: {
            version: {
                type: 'string',
                example: '0.1.20240801',
            },
            status_code: {
                type: 'integer',
                example: 20000,
            },
            status_message: {
                type: 'string',
                example: 'Ok.',
            },
            time: {
                type: 'string',
                format: 'date-time',
            },
            cost: {
                type: 'number',
                format: 'float',
                example: 0.105,
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
                },
            },
        },
    },
};
