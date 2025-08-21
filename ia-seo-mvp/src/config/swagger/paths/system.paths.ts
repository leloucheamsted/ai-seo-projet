export const systemPaths = {
    '/health': {
        get: {
            summary: 'Health check endpoint',
            tags: ['System'],
            responses: {
                200: {
                    description: 'System is healthy',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'OK' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                    uptime: { type: 'number' },
                                    environment: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/api': {
        get: {
            summary: 'API information',
            tags: ['System'],
            responses: {
                200: {
                    description: 'API information retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    version: { type: 'string' },
                                    description: { type: 'string' },
                                    endpoints: {
                                        type: 'object',
                                        properties: {
                                            auth: { type: 'string' },
                                            dashboard: { type: 'string' },
                                            taskCosts: { type: 'string' },
                                            keywordExplorer: { type: 'string' },
                                            urlAnalyzer: { type: 'string' },
                                            rankMonitor: { type: 'string' },
                                            settings: { type: 'string' }
                                        }
                                    },
                                    documentation: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
