import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

// Import schemas
import { commonSchemas, commonParameters, commonResponses, authSchemas, dashboardSchemas, taskCostSchemas, settingsSchemas, keywordExplorerSchemas, urlAnalyzerSchemas, rankMonitorSchemas } from './schemas';

// Import paths  
import { authPaths, dashboardPaths, taskCostsPaths, settingsPaths, dataForSEOPaths, systemPaths, keywordExplorerPaths, urlAnalyzerPaths, rankMonitorPaths } from './paths';


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
        parameters: {
            ...commonParameters,
        },
        responses: {
            ...commonResponses,
        },
        schemas: {
            // Merge all schemas from different modules
            ...commonSchemas,
            ...authSchemas,
            ...dashboardSchemas,
            ...taskCostSchemas,
            ...settingsSchemas,
            ...keywordExplorerSchemas,
            ...urlAnalyzerSchemas,
            ...rankMonitorSchemas,
        },
    },
    paths: {
        // Merge all paths from different modules
        ...authPaths,
        ...dashboardPaths,
        ...taskCostsPaths,
        ...settingsPaths,
        ...dataForSEOPaths,
        ...systemPaths,
        ...keywordExplorerPaths,
        ...urlAnalyzerPaths,
        ...rankMonitorPaths,
    },
    tags: [
        {
            name: 'Authentication',
            description: 'User authentication and authorization endpoints',
        },
        {
            name: 'Dashboard',
            description: 'Dashboard and analytics endpoints',
        },
        {
            name: 'Task Costs',
            description: 'Task cost management and tracking',
        },
        {
            name: 'Keyword Explorer',
            description: 'Keyword research and analysis endpoints',
        },
        {
            name: 'URL Analyzer',
            description: 'URL analysis and domain analytics endpoints',
        },
        {
            name: 'Rank Monitor',
            description: 'SERP ranking and competitor monitoring endpoints',
        },
        {
            name: 'Settings',
            description: 'User settings and configuration endpoints',
        },
        {
            name: 'DataForSEO',
            description: 'DataForSEO credentials management endpoints',
        },
        {
            name: 'System',
            description: 'System health and utility endpoints',
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: [], // Since we're defining everything in code, no need for file scanning
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
    .swagger-ui .tag-operations[data-tag="DataForSEO"] { order: 8; }
    .swagger-ui .tag-operations[data-tag="System"] { order: 9; }
  `,
    customSiteTitle: 'IA SEO MVP API Documentation',
    customfavIcon: '/favicon.ico',
};
