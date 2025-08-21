export const settingsSchemas = {
    DataForSEOCredentials: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Credential ID'
            },
            userId: {
                type: 'integer',
                description: 'User ID'
            },
            login: {
                type: 'string',
                description: 'DataForSEO login username'
            },
            password: {
                type: 'string',
                description: 'DataForSEO password (encrypted)'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
            }
        },
        required: ['userId', 'login', 'password']
    },
    DataForSEOCredentialsInput: {
        type: 'object',
        properties: {
            login: {
                type: 'string',
                minLength: 1,
                description: 'DataForSEO login username'
            },
            password: {
                type: 'string',
                minLength: 1,
                description: 'DataForSEO password'
            }
        },
        required: ['login', 'password']
    },
    DataForSEOCredentialsResponse: {
        type: 'object',
        properties: {
            login: {
                type: 'string',
                description: 'DataForSEO login username'
            },
            hasPassword: {
                type: 'boolean',
                description: 'Whether password is set'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
            }
        }
    }
};
