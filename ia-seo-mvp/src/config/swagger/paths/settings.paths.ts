export const settingsPaths = {
    '/api/settings/dataforseo': {
        get: {
            summary: 'Get DataForSEO credentials',
            tags: ['Settings'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'DataForSEO credentials retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            login: { type: 'string' },
                                            hasPassword: { type: 'boolean' },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                404: {
                    description: 'Credentials not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        },
        post: {
            summary: 'Set DataForSEO credentials',
            tags: ['Settings'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['login', 'password'],
                            properties: {
                                login: {
                                    type: 'string',
                                    description: 'DataForSEO login'
                                },
                                password: {
                                    type: 'string',
                                    description: 'DataForSEO password'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'DataForSEO credentials saved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid request data',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    }
};
