export const commonSchemas = {
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
    PaginationInfo: {
        type: 'object',
        properties: {
            current_page: {
                type: 'integer',
                description: 'Current page number',
                example: 1,
                minimum: 1,
            },
            total_pages: {
                type: 'integer',
                description: 'Total number of pages',
                example: 5,
                minimum: 0,
            },
            page_size: {
                type: 'integer',
                description: 'Number of items per page',
                example: 10,
                minimum: 1,
            },
            total_count: {
                type: 'integer',
                description: 'Total number of items',
                example: 47,
                minimum: 0,
            },
            has_next: {
                type: 'boolean',
                description: 'Whether there is a next page',
                example: true,
            },
            has_prev: {
                type: 'boolean',
                description: 'Whether there is a previous page',
                example: false,
            },
        },
        required: ['current_page', 'total_pages', 'page_size', 'total_count', 'has_next', 'has_prev'],
    },
    CreateGroupRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Group name',
                example: 'My Keyword Group'
            },
            description: {
                type: 'string',
                description: 'Group description',
                example: 'Keywords for main product category'
            }
        },
        required: ['name']
    },
    UpdateGroupRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Group name',
                example: 'Updated Group Name'
            },
            description: {
                type: 'string',
                description: 'Group description',
                example: 'Updated description'
            }
        }
    },
    GroupDetails: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Group ID',
                example: 123
            },
            name: {
                type: 'string',
                description: 'Group name',
                example: 'My Keyword Group'
            },
            description: {
                type: 'string',
                description: 'Group description',
                example: 'Keywords for main product category'
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
            },
            userId: {
                type: 'integer',
                description: 'Owner user ID'
            }
        }
    }
};

// Common parameters
export const commonParameters = {
    GroupId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Group ID',
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    Page: {
        name: 'page',
        in: 'query',
        description: 'Page number for pagination',
        schema: {
            type: 'integer',
            minimum: 1,
            default: 1
        }
    },
    Limit: {
        name: 'limit',
        in: 'query',
        description: 'Number of items per page',
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
        }
    }
};

// Common responses
export const commonResponses = {
    UnauthorizedError: {
        description: 'Unauthorized - invalid token',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
        }
    },
    BadRequest: {
        description: 'Bad request - invalid parameters',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
        }
    },
    NotFound: {
        description: 'Resource not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
        }
    },
    InternalServerError: {
        description: 'Internal server error',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
        }
    },
    GroupsList: {
        description: 'Groups list retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/GroupDetails' }
                        },
                        pagination: { $ref: '#/components/schemas/PaginationInfo' }
                    }
                }
            }
        }
    },
    GroupCreated: {
        description: 'Group created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Group created successfully' },
                        data: { $ref: '#/components/schemas/GroupDetails' }
                    }
                }
            }
        }
    },
    GroupUpdated: {
        description: 'Group updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Group updated successfully' },
                        data: { $ref: '#/components/schemas/GroupDetails' }
                    }
                }
            }
        }
    },
    GroupDetails: {
        description: 'Group details retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { $ref: '#/components/schemas/GroupDetails' }
                    }
                }
            }
        }
    }
};
