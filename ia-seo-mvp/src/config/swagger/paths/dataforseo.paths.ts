export const dataForSEOPaths = {
    '/api/dataforseo/credentials': {
        get: {
            tags: ['DataForSEO'],
            summary: 'Get DataForSEO credentials status',
            description: 'Retrieve the status of DataForSEO credentials for the authenticated user',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Credentials status retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            hasCredentials: {
                                                type: 'boolean',
                                                description: 'Indicates if user has credentials',
                                                example: true
                                            },
                                            isConfigured: {
                                                type: 'boolean',
                                                description: 'Indicates if credentials are properly configured',
                                                example: true
                                            },
                                            lastUpdated: {
                                                type: 'string',
                                                format: 'date-time',
                                                description: 'Last update date',
                                                example: '2023-01-01T00:00:00.000Z'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError'
                },
                500: {
                    $ref: '#/components/responses/InternalServerError'
                }
            }
        },
        post: {
            tags: ['DataForSEO'],
            summary: 'Save or update DataForSEO credentials',
            description: 'Save or update DataForSEO API credentials for the authenticated user',
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
                                    description: 'DataForSEO API login',
                                    example: 'your_login'
                                },
                                password: {
                                    type: 'string',
                                    description: 'DataForSEO API password',
                                    example: 'your_password'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Credentials saved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Credentials saved successfully'
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            hasCredentials: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            isConfigured: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            lastUpdated: {
                                                type: 'string',
                                                format: 'date-time'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    $ref: '#/components/responses/ValidationError'
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError'
                },
                500: {
                    $ref: '#/components/responses/InternalServerError'
                }
            }
        }
    },
    '/api/dataforseo/credentials/test': {
        post: {
            tags: ['DataForSEO'],
            summary: 'Test DataForSEO credentials',
            description: 'Test the validity of DataForSEO API credentials',
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
                                    description: 'DataForSEO API login to test',
                                    example: 'your_login'
                                },
                                password: {
                                    type: 'string',
                                    description: 'DataForSEO API password to test',
                                    example: 'your_password'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Test completed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    isValid: {
                                        type: 'boolean',
                                        description: 'Indicates if credentials are valid',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Credentials are valid'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    $ref: '#/components/responses/ValidationError'
                },
                401: {
                    $ref: '#/components/responses/UnauthorizedError'
                },
                500: {
                    $ref: '#/components/responses/InternalServerError'
                }
            }
        }
    }
};
