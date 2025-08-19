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

            // Common Schemas
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
