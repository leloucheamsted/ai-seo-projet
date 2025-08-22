export const authSchemas = {
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
            firstName: {
                type: 'string',
                description: 'User first name',
                example: 'John',
            },
            lastName: {
                type: 'string',
                description: 'User last name',
                example: 'Doe',
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
        required: ['email', 'password', 'passwordConfirmation', 'firstName', 'lastName'],
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
            passwordConfirmation: {
                type: 'string',
                minLength: 6,
                description: 'Password confirmation (must match password)',
                example: 'password123',
            },
            firstName: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                description: 'User first name (2-100 characters)',
                example: 'John',
            },
            lastName: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                description: 'User last name (2-100 characters)',
                example: 'Doe',
            },
        },
    },
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
        },
    },
};
