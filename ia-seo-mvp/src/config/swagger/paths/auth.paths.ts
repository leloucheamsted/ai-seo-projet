export const authPaths = {
    '/api/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'User login',
            description: 'Authenticate user with email and password',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LoginRequest',
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        $ref: '#/components/schemas/User',
                                    },
                                    tokens: {
                                        $ref: '#/components/schemas/AuthTokens',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid credentials',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/auth/register': {
        post: {
            tags: ['Authentication'],
            summary: 'User registration',
            description: 'Register a new user account',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RegisterRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Registration successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        $ref: '#/components/schemas/User',
                                    },
                                    tokens: {
                                        $ref: '#/components/schemas/AuthTokens',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Registration failed - validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                409: {
                    description: 'Email already exists',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/auth/refresh': {
        post: {
            tags: ['Authentication'],
            summary: 'Refresh access token',
            description: 'Refresh the access token using a valid refresh token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                refreshToken: {
                                    type: 'string',
                                    description: 'Valid refresh token',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                }
                            },
                            required: ['refreshToken']
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Token refreshed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: { $ref: '#/components/schemas/User' },
                                    tokens: { $ref: '#/components/schemas/AuthTokens' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid or expired refresh token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/auth/me': {
        get: {
            tags: ['Authentication'],
            summary: 'Get current user profile',
            description: 'Get the profile information of the currently authenticated user',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User profile retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: { $ref: '#/components/schemas/User' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid or expired token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'User logout',
            description: 'Logout the current user and invalidate tokens',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Logout successful',
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
                                        example: 'Successfully logged out'
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - no valid token provided',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    }
};
