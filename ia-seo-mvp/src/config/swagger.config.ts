import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'IA SEO MVP API',
        version: '1.0.0',
        description: 'API for SEO analysis with DataForSEO integration',
        contact: {
            name: 'IA SEO Team',
            email: 'support@ia-seo.com',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: process.env.API_BASE_URL || 'http://localhost:3000',
            description: 'Development server',
        },
        {
            url: 'https://api.ia-seo.com',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token for authentication',
            },
        },
        schemas: {
            // Authentication Schemas
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'User ID',
                        example: 1,
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'user@example.com',
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'User creation timestamp',
                    },
                    updated_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'User last update timestamp',
                    },
                },
            },
            AuthTokens: {
                type: 'object',
                properties: {
                    accessToken: {
                        type: 'string',
                        description: 'JWT access token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    refreshToken: {
                        type: 'string',
                        description: 'JWT refresh token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'user@example.com',
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        description: 'User password (minimum 6 characters)',
                        example: 'password123',
                    },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email address',
                        example: 'user@example.com',
                    },
                    password: {
                        type: 'string',
                        minLength: 6,
                        description: 'User password (minimum 6 characters)',
                        example: 'password123',
                    },
                },
            },

            // Dashboard Schemas
            DashboardOverview: {
                type: 'object',
                properties: {
                    totalApiCalls: {
                        type: 'integer',
                        description: 'Total number of API calls',
                        example: 1250,
                    },
                    totalCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost of API calls',
                        example: 45.50,
                    },
                    todayApiCalls: {
                        type: 'integer',
                        description: 'Number of API calls today',
                        example: 25,
                    },
                    todayCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Cost of API calls today',
                        example: 2.75,
                    },
                    thisMonthApiCalls: {
                        type: 'integer',
                        description: 'Number of API calls this month',
                        example: 450,
                    },
                    thisMonthCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Cost of API calls this month',
                        example: 18.25,
                    },
                    avgCostPerTask: {
                        type: 'number',
                        format: 'float',
                        description: 'Average cost per task',
                        example: 0.036,
                    },
                    lastApiCall: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date of last API call',
                        example: '2025-08-19T14:30:00Z',
                    },
                },
            },
            TasksByType: {
                type: 'object',
                properties: {
                    keywordsTasks: {
                        type: 'integer',
                        description: 'Number of keyword tasks',
                        example: 150,
                    },
                    serpTasks: {
                        type: 'integer',
                        description: 'Number of SERP tasks',
                        example: 89,
                    },
                    onpageTasks: {
                        type: 'integer',
                        description: 'Number of OnPage tasks',
                        example: 45,
                    },
                    contentAnalysisTasks: {
                        type: 'integer',
                        description: 'Number of content analysis tasks',
                        example: 32,
                    },
                    domainAnalysisTasks: {
                        type: 'integer',
                        description: 'Number of domain analysis tasks',
                        example: 28,
                    },
                },
            },
            CostByType: {
                type: 'object',
                properties: {
                    taskType: {
                        type: 'string',
                        description: 'Task type',
                        example: 'keywords_for_keywords',
                    },
                    totalCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost for this type',
                        example: 15.75,
                    },
                    taskCount: {
                        type: 'integer',
                        description: 'Number of tasks of this type',
                        example: 150,
                    },
                    avgCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Average cost for this type',
                        example: 0.105,
                    },
                },
            },
            RecentActivity: {
                type: 'object',
                properties: {
                    taskId: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_123456789',
                    },
                    taskType: {
                        type: 'string',
                        description: 'Task type',
                        example: 'keywords_for_keywords',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.105,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation date',
                        example: '2025-08-19T14:30:00Z',
                    },
                    endpoint: {
                        type: 'string',
                        description: 'API endpoint used',
                        example: '/v3/keywords_data/keywords_for_keywords/live',
                    },
                },
            },
            MonthlyTrend: {
                type: 'object',
                properties: {
                    month: {
                        type: 'string',
                        description: 'Month in YYYY-MM format',
                        example: '2025-08',
                    },
                    apiCalls: {
                        type: 'integer',
                        description: 'Number of API calls this month',
                        example: 450,
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost this month',
                        example: 18.25,
                    },
                },
            },
            TopEndpoint: {
                type: 'object',
                properties: {
                    endpoint: {
                        type: 'string',
                        description: 'Endpoint name',
                        example: '/v3/keywords_data/keywords_for_keywords/live',
                    },
                    callCount: {
                        type: 'integer',
                        description: 'Number of calls',
                        example: 150,
                    },
                    totalCost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 15.75,
                    },
                },
            },
            DashboardStats: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'integer',
                        description: 'User ID',
                        example: 1,
                    },
                    overview: {
                        $ref: '#/components/schemas/DashboardOverview',
                    },
                    tasksByType: {
                        $ref: '#/components/schemas/TasksByType',
                    },
                    costsByType: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/CostByType',
                        },
                    },
                    recentActivity: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/RecentActivity',
                        },
                    },
                    monthlyTrend: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/MonthlyTrend',
                        },
                    },
                    topEndpoints: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/TopEndpoint',
                        },
                    },
                },
            },

            // Task Cost Schemas
            TaskCost: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Task cost ID',
                        example: 1,
                    },
                    user_id: {
                        type: 'integer',
                        description: 'User ID',
                        example: 1,
                    },
                    task_id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_123456789',
                    },
                    task_type: {
                        type: 'string',
                        description: 'Task type',
                        example: 'keywords_for_keywords',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.105,
                    },
                    api_endpoint: {
                        type: 'string',
                        description: 'API endpoint',
                        example: '/v3/keywords_data/keywords_for_keywords/live',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'HTTP status code',
                        example: 200,
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation date',
                        example: '2025-08-19T14:30:00Z',
                    },
                },
            },

            // Keyword Explorer Schemas
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
            RelatedKeywordsKeywordInfo: {
                type: 'object',
                properties: {
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'google',
                    },
                    last_updated_time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update time',
                    },
                    competition: {
                        type: 'number',
                        format: 'float',
                        description: 'Competition level (0-1)',
                        example: 0.45,
                    },
                    cpc: {
                        type: 'number',
                        format: 'float',
                        description: 'Cost per click',
                        example: 1.25,
                    },
                    search_volume: {
                        type: 'integer',
                        description: 'Monthly search volume',
                        example: 1500,
                    },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'integer',
                        },
                        description: 'Category IDs',
                    },
                    monthly_searches: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                year: {
                                    type: 'integer',
                                    example: 2025,
                                },
                                month: {
                                    type: 'integer',
                                    example: 8,
                                },
                                search_volume: {
                                    type: 'integer',
                                    example: 1200,
                                },
                            },
                        },
                    },
                },
            },
            RelatedKeywordsKeywordData: {
                type: 'object',
                properties: {
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'google',
                    },
                    keyword: {
                        type: 'string',
                        description: 'Keyword',
                        example: 'SEO optimization',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    keyword_info: {
                        $ref: '#/components/schemas/RelatedKeywordsKeywordInfo',
                    },
                    keyword_properties: {
                        type: 'object',
                        properties: {
                            se_type: {
                                type: 'string',
                                example: 'google',
                            },
                            core_keyword: {
                                type: 'string',
                                nullable: true,
                                example: 'SEO',
                            },
                            keyword_difficulty: {
                                type: 'number',
                                format: 'float',
                                example: 65.5,
                            },
                        },
                    },
                    impressions_info: {
                        type: 'object',
                        description: 'Impressions information for advertising',
                    },
                    serp_info: {
                        type: 'object',
                        properties: {
                            se_type: {
                                type: 'string',
                                example: 'google',
                            },
                            check_url: {
                                type: 'string',
                                example: 'https://www.google.com/search?q=seo+tools',
                            },
                            serp_item_types: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                example: ['organic', 'paid'],
                            },
                            se_results_count: {
                                type: 'integer',
                                example: 125000000,
                            },
                            last_updated_time: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                },
            },
            RelatedKeywordsItem: {
                type: 'object',
                properties: {
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'google',
                    },
                    keyword_data: {
                        $ref: '#/components/schemas/RelatedKeywordsKeywordData',
                    },
                    depth: {
                        type: 'integer',
                        description: 'Depth level in related keywords tree',
                        example: 1,
                    },
                    related_keywords: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of related keywords',
                        example: ['SEO optimization', 'keyword research', 'search engine marketing'],
                    },
                },
            },
            RelatedKeywordsTask: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_12345678-1234-1234-1234-123456789012',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task execution time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.105,
                    },
                    result_count: {
                        type: 'integer',
                        description: 'Number of results',
                        example: 50,
                    },
                    path: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'API path',
                    },
                    data: {
                        type: 'object',
                        description: 'Task data parameters',
                    },
                    result: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                se_type: {
                                    type: 'string',
                                    example: 'google',
                                },
                                seed_keyword: {
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
                                total_count: {
                                    type: 'integer',
                                    example: 125,
                                },
                                items_count: {
                                    type: 'integer',
                                    example: 50,
                                },
                                items: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/RelatedKeywordsItem',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            RelatedKeywordsResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.105,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/RelatedKeywordsTask',
                        },
                        description: 'Array of tasks',
                    },
                },
            },

            // Keywords For Keywords Schemas
            KeywordsForKeywordsLiveParams: {
                type: 'object',
                required: ['keywords'],
                properties: {
                    keywords: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of keywords to analyze',
                        example: ['SEO tools', 'keyword research', 'digital marketing'],
                        minItems: 1,
                        maxItems: 1000,
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
                    location_coordinate: {
                        type: 'string',
                        description: 'Location coordinates (lat,lng)',
                        example: '40.7128,-74.0060',
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
                    search_partners: {
                        type: 'boolean',
                        description: 'Include Google search partners',
                        example: false,
                    },
                    date_from: {
                        type: 'string',
                        format: 'date',
                        description: 'Start date for historical data (YYYY-MM-DD)',
                        example: '2024-01-01',
                    },
                    date_to: {
                        type: 'string',
                        format: 'date',
                        description: 'End date for historical data (YYYY-MM-DD)',
                        example: '2024-12-31',
                    },
                    sort_by: {
                        type: 'string',
                        enum: ['relevance', 'search_volume', 'competition_index', 'low_top_of_page_bid', 'high_top_of_page_bid'],
                        description: 'Sort results by specified parameter',
                        example: 'search_volume',
                    },
                    include_adult_keywords: {
                        type: 'boolean',
                        description: 'Include adult keywords in results',
                        example: false,
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the request',
                        example: 'keyword-analysis-live',
                    },
                },
            },
            KeywordsForKeywordsPostParams: {
                type: 'object',
                required: ['keywords'],
                properties: {
                    keywords: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of keywords to analyze',
                        example: ['SEO tools', 'keyword research', 'digital marketing'],
                        minItems: 1,
                        maxItems: 1000,
                    },
                    target: {
                        type: 'string',
                        description: 'Target URL or domain for analysis',
                        example: 'example.com',
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
                    location_coordinate: {
                        type: 'string',
                        description: 'Location coordinates (lat,lng)',
                        example: '40.7128,-74.0060',
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
                    postback_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL for receiving postback notifications',
                        example: 'https://your-domain.com/postback',
                    },
                    pingback_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL for receiving pingback notifications',
                        example: 'https://your-domain.com/pingback',
                    },
                    search_partners: {
                        type: 'boolean',
                        description: 'Include Google search partners',
                        example: false,
                    },
                    date_from: {
                        type: 'string',
                        format: 'date',
                        description: 'Start date for historical data (YYYY-MM-DD)',
                        example: '2024-01-01',
                    },
                    date_to: {
                        type: 'string',
                        format: 'date',
                        description: 'End date for historical data (YYYY-MM-DD)',
                        example: '2024-12-31',
                    },
                    sort_by: {
                        type: 'string',
                        enum: ['relevance', 'search_volume', 'competition_index', 'low_top_of_page_bid', 'high_top_of_page_bid'],
                        description: 'Sort results by specified parameter',
                        example: 'search_volume',
                    },
                    include_adult_keywords: {
                        type: 'boolean',
                        description: 'Include adult keywords in results',
                        example: false,
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the request',
                        example: 'keyword-analysis-post',
                    },
                },
            },
            KeywordsForKeywordsKeywordData: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'The keyword',
                        example: 'SEO tools',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    search_partners: {
                        type: 'boolean',
                        description: 'Search partners included',
                        example: false,
                    },
                    competition: {
                        type: 'number',
                        format: 'float',
                        description: 'Competition level (0-1)',
                        example: 0.65,
                    },
                    competition_index: {
                        type: 'integer',
                        description: 'Competition index (0-100)',
                        example: 65,
                    },
                    search_volume: {
                        type: 'integer',
                        description: 'Average monthly search volume',
                        example: 12000,
                    },
                    low_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        description: 'Low estimate for top-of-page bid',
                        example: 1.25,
                    },
                    high_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        description: 'High estimate for top-of-page bid',
                        example: 3.75,
                    },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'integer',
                        },
                        description: 'Category IDs',
                    },
                    monthly_searches: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                year: {
                                    type: 'integer',
                                    example: 2025,
                                },
                                month: {
                                    type: 'integer',
                                    example: 8,
                                },
                                search_volume: {
                                    type: 'integer',
                                    example: 11500,
                                },
                            },
                        },
                    },
                },
            },
            KeywordsForKeywordsResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.01,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Ok.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task execution time',
                                },
                                cost: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'Task cost',
                                    example: 0.01,
                                },
                                result_count: {
                                    type: 'integer',
                                    description: 'Number of results',
                                    example: 3,
                                },
                                path: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'API path',
                                },
                                data: {
                                    type: 'object',
                                    description: 'Task parameters',
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/KeywordsForKeywordsKeywordData',
                                    },
                                    description: 'Keyword data results',
                                },
                            },
                        },
                    },
                },
            },
            KeywordsForKeywordsReadyResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.00,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Task ready.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task completion time',
                                },
                            },
                        },
                    },
                },
            },

            // Keywords For Site Schemas
            KeywordsForSiteParams: {
                type: 'object',
                required: ['target'],
                properties: {
                    target: {
                        type: 'string',
                        description: 'Target domain or URL to analyze',
                        example: 'example.com',
                    },
                    target_type: {
                        type: 'string',
                        enum: ['domain', 'url'],
                        description: 'Type of target analysis',
                        example: 'domain',
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
                    location_coordinate: {
                        type: 'string',
                        description: 'Location coordinates (lat,lng)',
                        example: '40.7128,-74.0060',
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
                    search_partners: {
                        type: 'boolean',
                        description: 'Include Google search partners',
                        example: false,
                    },
                    date_from: {
                        type: 'string',
                        format: 'date',
                        description: 'Start date for historical data (YYYY-MM-DD)',
                        example: '2024-01-01',
                    },
                    date_to: {
                        type: 'string',
                        format: 'date',
                        description: 'End date for historical data (YYYY-MM-DD)',
                        example: '2024-12-31',
                    },
                    sort_by: {
                        type: 'string',
                        enum: ['relevance', 'search_volume', 'competition_index', 'low_top_of_page_bid', 'high_top_of_page_bid'],
                        description: 'Sort results by specified parameter',
                        example: 'search_volume',
                    },
                    include_adult_keywords: {
                        type: 'boolean',
                        description: 'Include adult keywords in results',
                        example: false,
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the request',
                        example: 'site-keywords-analysis',
                    },
                },
            },
            KeywordForSiteResult: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'The keyword',
                        example: 'SEO tools',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    search_partners: {
                        type: 'boolean',
                        description: 'Search partners included',
                        example: false,
                    },
                    competition: {
                        type: 'string',
                        nullable: true,
                        description: 'Competition level',
                        example: 'MEDIUM',
                    },
                    competition_index: {
                        type: 'integer',
                        nullable: true,
                        description: 'Competition index (0-100)',
                        example: 65,
                    },
                    search_volume: {
                        type: 'integer',
                        description: 'Average monthly search volume',
                        example: 8500,
                    },
                    low_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        nullable: true,
                        description: 'Low estimate for top-of-page bid',
                        example: 1.15,
                    },
                    high_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        nullable: true,
                        description: 'High estimate for top-of-page bid',
                        example: 3.25,
                    },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'integer',
                        },
                        description: 'Category IDs',
                    },
                    monthly_searches: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                year: {
                                    type: 'integer',
                                    example: 2025,
                                },
                                month: {
                                    type: 'integer',
                                    example: 8,
                                },
                                search_volume: {
                                    type: 'integer',
                                    example: 7800,
                                },
                            },
                        },
                    },
                    keyword_annotations: {
                        type: 'object',
                        properties: {
                            concepts: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: 'SEO',
                                        },
                                        concept_group: {
                                            type: 'string',
                                            example: 'Technology',
                                        },
                                    },
                                },
                            },
                        },
                        description: 'Keyword annotations and concepts',
                    },
                },
            },
            KeywordsForSiteLiveResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.02,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'live_task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Ok.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task execution time',
                                },
                                cost: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'Task cost',
                                    example: 0.02,
                                },
                                result_count: {
                                    type: 'integer',
                                    description: 'Number of results',
                                    example: 25,
                                },
                                path: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'API path',
                                },
                                data: {
                                    type: 'object',
                                    properties: {
                                        location_code: {
                                            type: 'integer',
                                            example: 2840,
                                        },
                                        language_code: {
                                            type: 'string',
                                            example: 'en',
                                        },
                                        target: {
                                            type: 'string',
                                            example: 'example.com',
                                        },
                                    },
                                    description: 'Task parameters',
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/KeywordForSiteResult',
                                    },
                                    description: 'Site keyword data results',
                                },
                            },
                        },
                    },
                },
            },

            // Search Volume Schemas
            SearchVolumeParams: {
                type: 'object',
                required: ['keywords'],
                properties: {
                    keywords: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of keywords to get search volume data for',
                        example: ['SEO tools', 'keyword research', 'digital marketing'],
                        minItems: 1,
                        maxItems: 1000,
                    },
                    location_name: {
                        type: 'string',
                        description: 'Location name for search volume data',
                        example: 'United States',
                    },
                    location_code: {
                        type: 'string',
                        description: 'Location code for search volume data',
                        example: '2840',
                    },
                    location_coordinate: {
                        type: 'string',
                        description: 'Location coordinates (lat,lng)',
                        example: '40.7128,-74.0060',
                    },
                    language_name: {
                        type: 'string',
                        description: 'Language name for search volume data',
                        example: 'English',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code for search volume data',
                        example: 'en',
                    },
                    search_partners: {
                        type: 'boolean',
                        description: 'Include Google search partners in volume data',
                        example: false,
                    },
                    date_from: {
                        type: 'string',
                        format: 'date',
                        description: 'Start date for historical search volume data (YYYY-MM-DD)',
                        example: '2024-01-01',
                    },
                    date_to: {
                        type: 'string',
                        format: 'date',
                        description: 'End date for historical search volume data (YYYY-MM-DD)',
                        example: '2024-12-31',
                    },
                    sort_by: {
                        type: 'string',
                        enum: ['relevance', 'search_volume', 'competition_index', 'low_top_of_page_bid', 'high_top_of_page_bid'],
                        description: 'Sort search volume results by specified parameter',
                        example: 'search_volume',
                    },
                    include_adult_keywords: {
                        type: 'boolean',
                        description: 'Include adult keywords in search volume results',
                        example: false,
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the search volume request',
                        example: 'search-volume-analysis',
                    },
                },
            },
            SearchVolumeResult: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'The keyword',
                        example: 'SEO tools',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    search_partners: {
                        type: 'boolean',
                        description: 'Search partners included in volume data',
                        example: false,
                    },
                    competition: {
                        type: 'number',
                        format: 'float',
                        description: 'Competition level (0-1)',
                        example: 0.65,
                    },
                    competition_index: {
                        type: 'integer',
                        description: 'Competition index (0-100)',
                        example: 65,
                    },
                    search_volume: {
                        type: 'integer',
                        description: 'Average monthly search volume',
                        example: 12000,
                    },
                    low_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        description: 'Low estimate for top-of-page bid',
                        example: 1.25,
                    },
                    high_top_of_page_bid: {
                        type: 'number',
                        format: 'float',
                        description: 'High estimate for top-of-page bid',
                        example: 3.75,
                    },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'integer',
                        },
                        description: 'Category IDs',
                        example: [10019, 10023],
                    },
                    monthly_searches: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                year: {
                                    type: 'integer',
                                    description: 'Year',
                                    example: 2025,
                                },
                                month: {
                                    type: 'integer',
                                    description: 'Month (1-12)',
                                    example: 8,
                                },
                                search_volume: {
                                    type: 'integer',
                                    description: 'Search volume for that month',
                                    example: 11500,
                                },
                            },
                        },
                        description: 'Monthly search volume history',
                    },
                },
            },
            SearchVolumeResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.01,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'live_task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Ok.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task execution time',
                                },
                                cost: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'Task cost',
                                    example: 0.01,
                                },
                                result_count: {
                                    type: 'integer',
                                    description: 'Number of results',
                                    example: 3,
                                },
                                path: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'API path',
                                },
                                data: {
                                    type: 'object',
                                    properties: {
                                        location_code: {
                                            type: 'integer',
                                            example: 2840,
                                        },
                                        language_code: {
                                            type: 'string',
                                            example: 'en',
                                        },
                                        keywords: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                            },
                                            example: ['SEO tools', 'keyword research', 'digital marketing'],
                                        },
                                    },
                                    description: 'Task parameters',
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/SearchVolumeResult',
                                    },
                                    description: 'Search volume data results',
                                },
                            },
                        },
                    },
                },
            },

            // SERP Advanced Schemas
            SerpAdvancedParams: {
                type: 'object',
                required: ['keywords'],
                properties: {
                    keywords: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Array of keywords to analyze SERP results for',
                        example: ['SEO tools', 'keyword research'],
                        minItems: 1,
                        maxItems: 100,
                    },
                    url: {
                        type: 'string',
                        format: 'uri',
                        description: 'Specific URL to analyze in SERP',
                        example: 'https://example.com',
                    },
                    depth: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        description: 'Number of SERP results to analyze',
                        example: 10,
                    },
                    max_crawl_pages: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10,
                        description: 'Maximum number of pages to crawl',
                        example: 1,
                    },
                    location_name: {
                        type: 'string',
                        description: 'Location name for SERP analysis',
                        example: 'United States',
                    },
                    location_code: {
                        type: 'string',
                        description: 'Location code for SERP analysis',
                        example: '2840',
                    },
                    se_domain: {
                        type: 'string',
                        description: 'Search engine domain',
                        example: 'google.com',
                    },
                    device: {
                        type: 'string',
                        enum: ['desktop', 'mobile'],
                        description: 'Device type for SERP simulation',
                        example: 'desktop',
                    },
                    os: {
                        type: 'string',
                        description: 'Operating system for SERP simulation',
                        example: 'windows',
                    },
                    location_coordinate: {
                        type: 'string',
                        description: 'Location coordinates (lat,lng)',
                        example: '40.7128,-74.0060',
                    },
                    language_name: {
                        type: 'string',
                        description: 'Language name for SERP analysis',
                        example: 'English',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code for SERP analysis',
                        example: 'en',
                    },
                    target: {
                        type: 'string',
                        description: 'Target domain to focus analysis on',
                        example: 'example.com',
                    },
                    group_organic_results: {
                        type: 'boolean',
                        description: 'Group organic results from same domain',
                        example: false,
                    },
                    calculate_rectangles: {
                        type: 'boolean',
                        description: 'Calculate element rectangles in SERP',
                        example: false,
                    },
                    browser_screen_width: {
                        type: 'integer',
                        description: 'Browser screen width for rendering',
                        example: 1920,
                    },
                    browser_screen_height: {
                        type: 'integer',
                        description: 'Browser screen height for rendering',
                        example: 1080,
                    },
                    browser_screen_resolution_ratio: {
                        type: 'number',
                        format: 'float',
                        description: 'Browser screen resolution ratio',
                        example: 1.0,
                    },
                    people_also_ask_click_depth: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 4,
                        description: 'Depth for People Also Ask expansion',
                        example: 1,
                    },
                    load_async_ai_overview: {
                        type: 'boolean',
                        description: 'Load AI Overview content asynchronously',
                        example: false,
                    },
                    search_param: {
                        type: 'string',
                        description: 'Additional search parameters',
                        example: 'tbm=nws',
                    },
                    remove_from_url: {
                        type: 'string',
                        description: 'Parameters to remove from URLs',
                        example: 'utm_source,utm_medium',
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the SERP request',
                        example: 'serp-analysis',
                    },
                },
            },
            SerpAdvancedItem: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        description: 'Type of SERP item',
                        example: 'organic',
                    },
                    rank_group: {
                        type: 'integer',
                        description: 'Rank group in SERP',
                        example: 1,
                    },
                    rank_absolute: {
                        type: 'integer',
                        description: 'Absolute rank position',
                        example: 1,
                    },
                    position: {
                        type: 'string',
                        description: 'Position in SERP',
                        example: '1',
                    },
                    xpath: {
                        type: 'string',
                        description: 'XPath to element in DOM',
                        example: '//div[@data-ved]',
                    },
                    domain: {
                        type: 'string',
                        description: 'Domain of the result',
                        example: 'example.com',
                    },
                    title: {
                        type: 'string',
                        description: 'Title of the SERP result',
                        example: 'Best SEO Tools for 2025',
                    },
                    url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL of the result',
                        example: 'https://example.com/seo-tools',
                    },
                    cache_url: {
                        type: 'string',
                        nullable: true,
                        description: 'Cached version URL',
                        example: 'https://webcache.googleusercontent.com/...',
                    },
                    related_search_url: {
                        type: 'string',
                        nullable: true,
                        description: 'Related search URL',
                    },
                    breadcrumb: {
                        type: 'string',
                        description: 'Breadcrumb navigation',
                        example: 'example.com › tools › seo',
                    },
                    is_image: {
                        type: 'boolean',
                        description: 'Whether result contains images',
                        example: false,
                    },
                    is_video: {
                        type: 'boolean',
                        description: 'Whether result contains videos',
                        example: false,
                    },
                    is_featured_snippet: {
                        type: 'boolean',
                        description: 'Whether result is a featured snippet',
                        example: false,
                    },
                    is_malicious: {
                        type: 'boolean',
                        description: 'Whether result is flagged as malicious',
                        example: false,
                    },
                    is_web_story: {
                        type: 'boolean',
                        description: 'Whether result is a web story',
                        example: false,
                    },
                    description: {
                        type: 'string',
                        description: 'Description/snippet of the result',
                        example: 'Discover the best SEO tools for 2025 to improve your website ranking...',
                    },
                    pre_snippet: {
                        type: 'string',
                        nullable: true,
                        description: 'Text before the main snippet',
                    },
                    extended_snippet: {
                        type: 'string',
                        nullable: true,
                        description: 'Extended snippet text',
                    },
                    images: {
                        type: 'object',
                        description: 'Images associated with the result',
                    },
                    amp_version: {
                        type: 'boolean',
                        description: 'Whether result has AMP version',
                        example: false,
                    },
                    rating: {
                        type: 'object',
                        description: 'Rating information if available',
                    },
                    price: {
                        type: 'object',
                        description: 'Price information if available',
                    },
                    highlighted: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Highlighted keywords in the result',
                        example: ['SEO', 'tools'],
                    },
                    links: {
                        type: 'object',
                        description: 'Additional links in the result',
                    },
                    faq: {
                        type: 'object',
                        description: 'FAQ section if present',
                    },
                    extended_people_also_search: {
                        type: 'object',
                        description: 'Extended people also search data',
                    },
                    about_this_result: {
                        type: 'object',
                        description: 'About this result information',
                    },
                    related_result: {
                        type: 'object',
                        description: 'Related result information',
                    },
                    timestamp: {
                        type: 'string',
                        nullable: true,
                        format: 'date-time',
                        description: 'Timestamp of the result',
                    },
                    rectangle: {
                        type: 'object',
                        description: 'Element rectangle coordinates',
                    },
                },
            },
            SerpAdvancedResult: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'The searched keyword',
                        example: 'SEO tools',
                    },
                    type: {
                        type: 'string',
                        description: 'Type of search',
                        example: 'organic',
                    },
                    se_domain: {
                        type: 'string',
                        description: 'Search engine domain',
                        example: 'google.com',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    check_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL that was checked',
                        example: 'https://www.google.com/search?q=seo+tools',
                    },
                    datetime: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date and time of the search',
                    },
                    spell: {
                        type: 'string',
                        nullable: true,
                        description: 'Spelling correction if any',
                    },
                    item_types: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Types of items found in SERP',
                        example: ['organic', 'people_also_ask', 'related_searches'],
                    },
                    se_results_count: {
                        type: 'integer',
                        description: 'Total number of search results',
                        example: 125000000,
                    },
                    items_count: {
                        type: 'integer',
                        description: 'Number of items in this response',
                        example: 10,
                    },
                    items: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpAdvancedItem',
                        },
                        description: 'SERP items/results',
                    },
                },
            },
            SerpAdvancedResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.25,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'live_task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Ok.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task execution time',
                                },
                                cost: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'Task cost',
                                    example: 0.25,
                                },
                                result_count: {
                                    type: 'integer',
                                    description: 'Number of results',
                                    example: 1,
                                },
                                path: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'API path',
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
                                            example: 'live',
                                        },
                                        se: {
                                            type: 'string',
                                            example: 'google',
                                        },
                                        se_type: {
                                            type: 'string',
                                            example: 'organic',
                                        },
                                        language_name: {
                                            type: 'string',
                                            example: 'English',
                                        },
                                        location_name: {
                                            type: 'string',
                                            example: 'United States',
                                        },
                                        keyword: {
                                            type: 'string',
                                            example: 'SEO tools',
                                        },
                                        device: {
                                            type: 'string',
                                            example: 'desktop',
                                        },
                                        os: {
                                            type: 'string',
                                            example: 'windows',
                                        },
                                    },
                                    description: 'Task parameters',
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/SerpAdvancedResult',
                                    },
                                    description: 'SERP analysis results',
                                },
                            },
                        },
                    },
                },
            },

            // Domain Competitors Schemas (Rank Monitor)
            DomainCompetitorsParams: {
                type: 'object',
                required: ['target'],
                properties: {
                    target: {
                        type: 'string',
                        description: 'Target domain for competitor analysis',
                        example: 'example.com',
                    },
                    location_name: {
                        type: 'string',
                        description: 'Location name for competitor analysis',
                        example: 'United States',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code for competitor analysis',
                        example: 2840,
                    },
                    language_name: {
                        type: 'string',
                        description: 'Language name for competitor analysis',
                        example: 'English',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code for competitor analysis',
                        example: 'en',
                    },
                    item_types: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['organic', 'paid', 'featured_snippet', 'local_pack'],
                        },
                        description: 'Types of search results to analyze for competitors',
                        example: ['organic', 'paid'],
                    },
                    include_clickstream_data: {
                        type: 'boolean',
                        description: 'Include clickstream data in competitor analysis',
                        example: false,
                    },
                    filters: {
                        type: 'array',
                        items: {
                            type: 'object',
                        },
                        description: 'Filter conditions for competitor results',
                    },
                    order_by: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Order conditions for competitor results',
                        example: ['intersections.desc'],
                    },
                    limit: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 1000,
                        description: 'Maximum number of competitor results',
                        example: 100,
                    },
                    offset: {
                        type: 'integer',
                        minimum: 0,
                        description: 'Offset for pagination of competitor results',
                        example: 0,
                    },
                    max_rank_group: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                        description: 'Maximum rank group to consider',
                        example: 20,
                    },
                    exclude_top_domains: {
                        type: 'boolean',
                        description: 'Exclude top-level domains from competitor analysis',
                        example: false,
                    },
                    intersecting_domains: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Specific domains to include in intersection analysis',
                        example: ['competitor1.com', 'competitor2.com'],
                    },
                    ignore_synonyms: {
                        type: 'boolean',
                        description: 'Ignore synonyms in competitor analysis',
                        example: false,
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the competitor analysis request',
                        example: 'competitor-analysis',
                    },
                },
            },
            DomainCompetitorMetrics: {
                type: 'object',
                properties: {
                    organic: {
                        type: 'object',
                        properties: {
                            pos_1: {
                                type: 'integer',
                                description: 'Number of keywords in position 1',
                                example: 15,
                            },
                            pos_2_3: {
                                type: 'integer',
                                description: 'Number of keywords in positions 2-3',
                                example: 23,
                            },
                            pos_4_10: {
                                type: 'integer',
                                description: 'Number of keywords in positions 4-10',
                                example: 65,
                            },
                            pos_11_20: {
                                type: 'integer',
                                description: 'Number of keywords in positions 11-20',
                                example: 45,
                            },
                            pos_21_30: {
                                type: 'integer',
                                description: 'Number of keywords in positions 21-30',
                                example: 32,
                            },
                            pos_31_40: {
                                type: 'integer',
                                description: 'Number of keywords in positions 31-40',
                                example: 18,
                            },
                            pos_41_50: {
                                type: 'integer',
                                description: 'Number of keywords in positions 41-50',
                                example: 12,
                            },
                            pos_51_100: {
                                type: 'integer',
                                description: 'Number of keywords in positions 51-100',
                                example: 25,
                            },
                            etv: {
                                type: 'number',
                                format: 'float',
                                description: 'Estimated traffic value',
                                example: 15420.50,
                            },
                            impressions_etv: {
                                type: 'number',
                                format: 'float',
                                description: 'Estimated traffic value from impressions',
                                example: 8750.25,
                            },
                            count: {
                                type: 'integer',
                                description: 'Total count of organic keywords',
                                example: 235,
                            },
                            estimated_paid_traffic_cost: {
                                type: 'number',
                                format: 'float',
                                description: 'Estimated cost if traffic was paid',
                                example: 25680.75,
                            },
                        },
                        description: 'Organic search metrics',
                    },
                    paid: {
                        type: 'object',
                        properties: {
                            pos_1: {
                                type: 'integer',
                                description: 'Number of paid ads in position 1',
                                example: 5,
                            },
                            pos_2_3: {
                                type: 'integer',
                                description: 'Number of paid ads in positions 2-3',
                                example: 8,
                            },
                            pos_4_10: {
                                type: 'integer',
                                description: 'Number of paid ads in positions 4-10',
                                example: 12,
                            },
                            etv: {
                                type: 'number',
                                format: 'float',
                                description: 'Estimated traffic value for paid',
                                example: 5420.30,
                            },
                            count: {
                                type: 'integer',
                                description: 'Total count of paid keywords',
                                example: 25,
                            },
                        },
                        description: 'Paid search metrics',
                    },
                    local_pack: {
                        type: 'object',
                        description: 'Local pack metrics',
                    },
                    featured_snippet: {
                        type: 'object',
                        description: 'Featured snippet metrics',
                    },
                },
            },
            DomainCompetitorItem: {
                type: 'object',
                properties: {
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'google',
                    },
                    domain: {
                        type: 'string',
                        description: 'Competitor domain',
                        example: 'competitor.com',
                    },
                    avg_position: {
                        type: 'number',
                        format: 'float',
                        description: 'Average position of competitor for intersecting keywords',
                        example: 15.4,
                    },
                    sum_position: {
                        type: 'integer',
                        description: 'Sum of all positions for intersecting keywords',
                        example: 1540,
                    },
                    intersections: {
                        type: 'integer',
                        description: 'Number of intersecting keywords with target domain',
                        example: 100,
                    },
                    full_domain_metrics: {
                        $ref: '#/components/schemas/DomainCompetitorMetrics',
                        description: 'Complete domain metrics across all keywords',
                    },
                    metrics: {
                        $ref: '#/components/schemas/DomainCompetitorMetrics',
                        description: 'Metrics for intersecting keywords only',
                    },
                    competitor_metrics: {
                        $ref: '#/components/schemas/DomainCompetitorMetrics',
                        description: 'Competitor-specific metrics comparison',
                    },
                },
            },
            DomainCompetitorsResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.12,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Task ID',
                                    example: 'live_task_12345678-1234-1234-1234-123456789012',
                                },
                                status_code: {
                                    type: 'integer',
                                    description: 'Task status code',
                                    example: 20000,
                                },
                                status_message: {
                                    type: 'string',
                                    description: 'Task status message',
                                    example: 'Ok.',
                                },
                                time: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Task execution time',
                                },
                                cost: {
                                    type: 'number',
                                    format: 'float',
                                    description: 'Task cost',
                                    example: 0.12,
                                },
                                result_count: {
                                    type: 'integer',
                                    description: 'Number of results',
                                    example: 1,
                                },
                                path: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'API path',
                                },
                                data: {
                                    type: 'object',
                                    properties: {
                                        api: {
                                            type: 'string',
                                            example: 'domain_analytics',
                                        },
                                        function: {
                                            type: 'string',
                                            example: 'competitors',
                                        },
                                        se_type: {
                                            type: 'string',
                                            example: 'google',
                                        },
                                        target: {
                                            type: 'string',
                                            example: 'example.com',
                                        },
                                        location_code: {
                                            type: 'integer',
                                            example: 2840,
                                        },
                                        language_name: {
                                            type: 'string',
                                            example: 'English',
                                        },
                                        limit: {
                                            type: 'integer',
                                            example: 100,
                                        },
                                    },
                                    description: 'Task parameters',
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            se_type: {
                                                type: 'string',
                                                example: 'google',
                                            },
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
                                            total_count: {
                                                type: 'integer',
                                                description: 'Total number of competitors found',
                                                example: 250,
                                            },
                                            items_count: {
                                                type: 'integer',
                                                description: 'Number of competitors in this response',
                                                example: 100,
                                            },
                                            items: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/DomainCompetitorItem',
                                                },
                                                description: 'List of domain competitors',
                                            },
                                        },
                                    },
                                    description: 'Domain competitor analysis results',
                                },
                            },
                        },
                    },
                },
            },

            // SERP Task Schemas (Rank Monitor)
            SerpTaskPostParams: {
                type: 'object',
                required: ['keyword'],
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'Target keyword for SERP analysis',
                        example: 'SEO tools',
                    },
                    url: {
                        type: 'string',
                        description: 'Specific URL to analyze in SERP',
                        example: 'https://example.com/page',
                    },
                    priority: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 3,
                        description: 'Task priority (1-3)',
                        example: 2,
                    },
                    depth: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 700,
                        description: 'Maximum number of results to analyze',
                        example: 100,
                    },
                    max_crawl_pages: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 10,
                        description: 'Maximum number of pages to crawl',
                        example: 1,
                    },
                    location_name: {
                        type: 'string',
                        description: 'Location name for localized SERP results',
                        example: 'United States',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code for localized SERP results',
                        example: 2840,
                    },
                    location_coordinate: {
                        type: 'string',
                        description: 'GPS coordinates for location-based SERP',
                        example: '40.7128,-74.0060',
                    },
                    language_name: {
                        type: 'string',
                        description: 'Language name for SERP results',
                        example: 'English',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code for SERP results',
                        example: 'en',
                    },
                    se_domain: {
                        type: 'string',
                        description: 'Search engine domain',
                        example: 'google.com',
                    },
                    device: {
                        type: 'string',
                        enum: ['desktop', 'mobile'],
                        description: 'Device type for SERP analysis',
                        example: 'desktop',
                    },
                    os: {
                        type: 'string',
                        enum: ['windows', 'macos', 'android', 'ios'],
                        description: 'Operating system for SERP analysis',
                        example: 'windows',
                    },
                    group_organic_results: {
                        type: 'boolean',
                        description: 'Group organic results from the same domain',
                        example: false,
                    },
                    calculate_rectangles: {
                        type: 'boolean',
                        description: 'Calculate element rectangles in SERP',
                        example: false,
                    },
                    browser_screen_width: {
                        type: 'integer',
                        description: 'Browser screen width in pixels',
                        example: 1920,
                    },
                    browser_screen_height: {
                        type: 'integer',
                        description: 'Browser screen height in pixels',
                        example: 1080,
                    },
                    browser_screen_resolution_ratio: {
                        type: 'number',
                        format: 'float',
                        description: 'Browser screen resolution ratio',
                        example: 1.0,
                    },
                    people_also_ask_click_depth: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 4,
                        description: 'Depth of People Also Ask expansion',
                        example: 0,
                    },
                    load_async_ai_overview: {
                        type: 'boolean',
                        description: 'Load asynchronous AI overview',
                        example: false,
                    },
                    expand_ai_overview: {
                        type: 'boolean',
                        description: 'Expand AI overview section',
                        example: false,
                    },
                    search_param: {
                        type: 'string',
                        description: 'Additional search parameters',
                    },
                    remove_from_url: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'URL parameters to remove',
                    },
                    tag: {
                        type: 'string',
                        description: 'Tag for the SERP task',
                        example: 'serp-analysis',
                    },
                    postback_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL for task completion notification',
                    },
                    postback_data: {
                        type: 'string',
                        enum: ['regular', 'advanced', 'html'],
                        description: 'Type of data to include in postback',
                        example: 'regular',
                    },
                    pingback_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL for task status notifications',
                    },
                },
            },
            SerpTaskPostTaskData: {
                type: 'object',
                properties: {
                    api: {
                        type: 'string',
                        description: 'API service',
                        example: 'serp',
                    },
                    function: {
                        type: 'string',
                        description: 'API function',
                        example: 'task_post',
                    },
                    se: {
                        type: 'string',
                        description: 'Search engine',
                        example: 'google',
                    },
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'organic',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    keyword: {
                        type: 'string',
                        description: 'Target keyword',
                        example: 'SEO tools',
                    },
                    device: {
                        type: 'string',
                        description: 'Device type',
                        example: 'desktop',
                    },
                    tag: {
                        type: 'string',
                        description: 'Task tag',
                        example: 'serp-analysis',
                    },
                    postback_url: {
                        type: 'string',
                        description: 'Postback URL',
                    },
                    postback_data: {
                        type: 'string',
                        description: 'Postback data type',
                        example: 'regular',
                    },
                    os: {
                        type: 'string',
                        description: 'Operating system',
                        example: 'windows',
                    },
                },
            },
            SerpTaskPostTask: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_12345678-1234-1234-1234-123456789012',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Task status code',
                        example: 20100,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Task status message',
                        example: 'Task Created.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task creation time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.003,
                    },
                    result_count: {
                        type: 'integer',
                        description: 'Number of results',
                        example: 0,
                    },
                    path: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'API path',
                        example: ['v3', 'serp', 'google', 'organic', 'task_post'],
                    },
                    data: {
                        $ref: '#/components/schemas/SerpTaskPostTaskData',
                        description: 'Task parameters',
                    },
                    result: {
                        type: 'null',
                        description: 'Results (null for task_post)',
                    },
                },
            },
            SerpTaskPostResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.003,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpTaskPostTask',
                        },
                        description: 'Created SERP tasks',
                    },
                },
            },
            SerpTaskGetTaskData: {
                type: 'object',
                properties: {
                    api: {
                        type: 'string',
                        description: 'API service',
                        example: 'serp',
                    },
                    function: {
                        type: 'string',
                        description: 'API function',
                        example: 'task_get',
                    },
                    se: {
                        type: 'string',
                        description: 'Search engine',
                        example: 'google',
                    },
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'organic',
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    keyword: {
                        type: 'string',
                        description: 'Target keyword',
                        example: 'SEO tools',
                    },
                    device: {
                        type: 'string',
                        description: 'Device type',
                        example: 'desktop',
                    },
                    tag: {
                        type: 'string',
                        description: 'Task tag',
                        example: 'serp-analysis',
                    },
                    postback_url: {
                        type: 'string',
                        description: 'Postback URL',
                    },
                    postback_data: {
                        type: 'string',
                        description: 'Postback data type',
                        example: 'regular',
                    },
                    os: {
                        type: 'string',
                        description: 'Operating system',
                        example: 'windows',
                    },
                },
            },
            SerpTaskGetResult: {
                type: 'object',
                properties: {
                    keyword: {
                        type: 'string',
                        description: 'Search keyword',
                        example: 'SEO tools',
                    },
                    type: {
                        type: 'string',
                        description: 'Result type',
                        example: 'organic',
                    },
                    se_domain: {
                        type: 'string',
                        description: 'Search engine domain',
                        example: 'google.com',
                    },
                    location_code: {
                        type: 'integer',
                        description: 'Location code',
                        example: 2840,
                    },
                    language_code: {
                        type: 'string',
                        description: 'Language code',
                        example: 'en',
                    },
                    check_url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL checked for SERP',
                        example: 'https://www.google.com/search?q=SEO+tools',
                    },
                    datetime: {
                        type: 'string',
                        format: 'date-time',
                        description: 'SERP check datetime',
                    },
                    spell: {
                        type: 'string',
                        nullable: true,
                        description: 'Spell correction suggestion',
                    },
                    item_types: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'Types of SERP items found',
                        example: ['organic', 'paid', 'people_also_ask'],
                    },
                    se_results_count: {
                        type: 'integer',
                        description: 'Total results count from search engine',
                        example: 2450000,
                    },
                    items_count: {
                        type: 'integer',
                        description: 'Number of items in this response',
                        example: 100,
                    },
                    items: {
                        type: 'array',
                        items: {
                            type: 'object',
                            description: 'SERP result items',
                        },
                        description: 'Detailed SERP result items',
                    },
                },
            },
            SerpTaskGetTask: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_12345678-1234-1234-1234-123456789012',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Task status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Task status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task completion time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.003,
                    },
                    result_count: {
                        type: 'integer',
                        description: 'Number of results',
                        example: 1,
                    },
                    path: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'API path',
                        example: ['v3', 'serp', 'google', 'organic', 'task_get'],
                    },
                    data: {
                        $ref: '#/components/schemas/SerpTaskGetTaskData',
                        description: 'Task parameters',
                    },
                    result: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpTaskGetResult',
                        },
                        description: 'SERP analysis results',
                    },
                },
            },
            SerpTaskGetResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.003,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpTaskGetTask',
                        },
                        description: 'SERP task results',
                    },
                },
            },
            SerpTaskReadyData: {
                type: 'object',
                properties: {
                    api: {
                        type: 'string',
                        description: 'API service',
                        example: 'serp',
                    },
                    function: {
                        type: 'string',
                        description: 'API function',
                        example: 'tasks_ready',
                    },
                    se: {
                        type: 'string',
                        description: 'Search engine',
                        example: 'google',
                    },
                },
            },
            SerpTaskReadyResult: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_12345678-1234-1234-1234-123456789012',
                    },
                    se: {
                        type: 'string',
                        description: 'Search engine',
                        example: 'google',
                    },
                    se_type: {
                        type: 'string',
                        description: 'Search engine type',
                        example: 'organic',
                    },
                    date_posted: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task creation date',
                    },
                    tag: {
                        type: 'string',
                        description: 'Task tag',
                        example: 'serp-analysis',
                    },
                    endpoint_regular: {
                        type: 'string',
                        nullable: true,
                        description: 'Regular endpoint for results',
                        example: '/v3/serp/google/organic/task_get/regular/task_12345678-1234-1234-1234-123456789012',
                    },
                    endpoint_advanced: {
                        type: 'string',
                        nullable: true,
                        description: 'Advanced endpoint for results',
                        example: '/v3/serp/google/organic/task_get/advanced/task_12345678-1234-1234-1234-123456789012',
                    },
                    endpoint_html: {
                        type: 'string',
                        nullable: true,
                        description: 'HTML endpoint for results',
                        example: '/v3/serp/google/organic/task_get/html/task_12345678-1234-1234-1234-123456789012',
                    },
                },
            },
            SerpTaskReadyTask: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Task ID',
                        example: 'task_12345678-1234-1234-1234-123456789012',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Task status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Task status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Task ready time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Task cost',
                        example: 0.003,
                    },
                    result_count: {
                        type: 'integer',
                        description: 'Number of ready results',
                        example: 1,
                    },
                    path: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'API path',
                        example: ['v3', 'serp', 'google', 'organic', 'tasks_ready'],
                    },
                    data: {
                        $ref: '#/components/schemas/SerpTaskReadyData',
                        description: 'Task parameters',
                    },
                    result: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpTaskReadyResult',
                        },
                        description: 'Ready SERP tasks information',
                    },
                },
            },
            SerpTaskReadyResponse: {
                type: 'object',
                properties: {
                    version: {
                        type: 'string',
                        description: 'API version',
                        example: '0.1.20240801',
                    },
                    status_code: {
                        type: 'integer',
                        description: 'Status code',
                        example: 20000,
                    },
                    status_message: {
                        type: 'string',
                        description: 'Status message',
                        example: 'Ok.',
                    },
                    time: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Response time',
                    },
                    cost: {
                        type: 'number',
                        format: 'float',
                        description: 'Total cost',
                        example: 0.003,
                    },
                    tasks_count: {
                        type: 'integer',
                        description: 'Number of tasks',
                        example: 1,
                    },
                    tasks_error: {
                        type: 'integer',
                        description: 'Number of errors',
                        example: 0,
                    },
                    tasks: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/SerpTaskReadyTask',
                        },
                        description: 'Ready SERP tasks',
                    },
                },
            },

            // Common Schemas
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error message',
                        example: 'Validation error',
                    },
                    code: {
                        type: 'string',
                        description: 'Error code',
                        example: 'VALIDATION_ERROR',
                    },
                    details: {
                        type: 'string',
                        description: 'Additional error details',
                        example: 'The request contains invalid parameters',
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Error type',
                        example: 'Validation error',
                    },
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'Email and password are required',
                    },
                    details: {
                        type: 'object',
                        description: 'Additional error details (development only)',
                    },
                },
            },
            SuccessResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        description: 'Operation success status',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        description: 'Success message',
                        example: 'Operation completed successfully',
                    },
                    data: {
                        type: 'object',
                        description: 'Response data',
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization',
        },
        {
            name: 'Dashboard',
            description: 'User dashboard and statistics',
        },
        {
            name: 'Task Costs',
            description: 'API cost tracking and analytics',
        },
        {
            name: 'Keyword Explorer',
            description: 'Keyword research and analysis',
        },
        {
            name: 'URL Analyzer',
            description: 'Website and page analysis',
        },
        {
            name: 'Rank Monitor',
            description: 'Ranking position tracking',
        },
        {
            name: 'Settings',
            description: 'User settings and configuration',
        },
        {
            name: 'System',
            description: 'System health and information',
        },
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: [
        './src/api/**/*.ts',
        './src/api/**/*.js',
        './src/middlewares/**/*.ts',
        './src/middlewares/**/*.js',
    ],
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
    },
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { margin: 20px 0 30px 0 }
    .swagger-ui .tag-operations { order: 1; }
    .swagger-ui .tag-operations[data-tag="Authentication"] { order: 1; }
    .swagger-ui .tag-operations[data-tag="Dashboard"] { order: 2; }
    .swagger-ui .tag-operations[data-tag="Task Costs"] { order: 3; }
    .swagger-ui .tag-operations[data-tag="Keyword Explorer"] { order: 4; }
    .swagger-ui .tag-operations[data-tag="URL Analyzer"] { order: 5; }
    .swagger-ui .tag-operations[data-tag="Rank Monitor"] { order: 6; }
    .swagger-ui .tag-operations[data-tag="Settings"] { order: 7; }
    .swagger-ui .tag-operations[data-tag="System"] { order: 8; }
  `,
    customSiteTitle: 'IA SEO MVP API Documentation',
    customfavIcon: '/favicon.ico',
};
