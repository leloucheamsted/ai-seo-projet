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
            DomainRankOverviewParams: {
                type: 'object',
                properties: {
                    target: {
                        type: 'string',
                        description: 'Domain or URL to analyze'
                    },
                    // Ajoute ici les autres propriétés attendues par DomainRankOverviewParams
                },
                required: ['target']
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
            KeywordSearch: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Search ID',
                        example: 1,
                    },
                    user_id: {
                        type: 'integer',
                        description: 'User ID who performed the search',
                        example: 1,
                    },
                    keyword: {
                        type: 'string',
                        description: 'Search keyword',
                        example: 'seo tools',
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Search timestamp',
                    },
                },
            },
            Keyword: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Keyword ID',
                        example: 1,
                    },
                    keyword_text: {
                        type: 'string',
                        description: 'Keyword text',
                        example: 'best seo tools',
                    },
                    search_volume: {
                        type: 'integer',
                        description: 'Monthly search volume',
                        example: 5000,
                    },
                    cpc: {
                        type: 'number',
                        format: 'float',
                        description: 'Cost per click',
                        example: 2.50,
                    },
                    keyword_difficulty: {
                        type: 'number',
                        format: 'float',
                        description: 'Keyword difficulty score (0-100)',
                        example: 65.5,
                    },
                    search_intent: {
                        type: 'string',
                        description: 'Search intent',
                        example: 'commercial',
                        enum: ['informational', 'navigational', 'commercial', 'transactional'],
                    },
                    opportunity_score: {
                        type: 'number',
                        format: 'float',
                        description: 'Opportunity score (0-100)',
                        example: 78.2,
                    },
                    serp_snapshot: {
                        type: 'object',
                        description: 'SERP features and results snapshot',
                    },
                },
            },
            UrlAudit: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Audit ID',
                        example: 1,
                    },
                    user_id: {
                        type: 'integer',
                        description: 'User ID who requested the audit',
                        example: 1,
                    },
                    url: {
                        type: 'string',
                        format: 'uri',
                        description: 'URL being audited',
                        example: 'https://example.com',
                    },
                    status: {
                        type: 'string',
                        description: 'Audit status',
                        example: 'completed',
                        enum: ['pending', 'completed', 'failed'],
                    },
                    requested_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Audit request timestamp',
                    },
                    completed_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Audit completion timestamp',
                    },
                },
            },
            RankMonitor: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Rank monitor ID',
                        example: 1,
                    },
                    user_id: {
                        type: 'integer',
                        description: 'User ID',
                        example: 1,
                    },
                    domain: {
                        type: 'string',
                        description: 'Domain being monitored',
                        example: 'example.com',
                    },
                    keyword: {
                        type: 'string',
                        description: 'Keyword being tracked',
                        example: 'seo tools',
                    },
                    current_position: {
                        type: 'integer',
                        description: 'Current ranking position',
                        example: 3,
                    },
                    tracked_date: {
                        type: 'string',
                        format: 'date',
                        description: 'Date of tracking',
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
            RateLimitInfo: {
                type: 'object',
                properties: {
                    current: {
                        type: 'integer',
                        description: 'Current usage count',
                        example: 15,
                    },
                    limit: {
                        type: 'integer',
                        description: 'Usage limit',
                        example: 1000,
                    },
                    remaining: {
                        type: 'integer',
                        description: 'Remaining requests',
                        example: 985,
                    },
                    resetTime: {
                        type: 'string',
                        format: 'date-time',
                        description: 'When the limit resets',
                    },
                },
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization',
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
            name: 'System',
            description: 'System health and information',
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
    },
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { margin: 20px 0 30px 0 }
  `,
    customSiteTitle: 'IA SEO MVP API Documentation',
    customfavIcon: '/favicon.ico',
};
