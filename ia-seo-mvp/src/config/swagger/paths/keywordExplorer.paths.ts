export const keywordExplorerPaths = {
    '/api/keyword-explorer/related-keywords/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get related keywords',
            description: 'Get related keywords for a target keyword using DataForSEO Labs API',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RelatedKeywordsParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Related keywords retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RelatedKeywordsResponse' }
                        }
                    }
                },
                400: {
                    description: 'Bad request - invalid parameters',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid token',
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
    '/api/keyword-explorer/related-keywords/groups': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get related keywords groups',
            description: 'Get grouped related keywords tasks with pagination',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page number for pagination',
                    schema: { type: 'integer', minimum: 1, default: 1 }
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Number of groups per page',
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
                }
            ],
            responses: {
                200: {
                    description: 'Related keywords groups retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RelatedKeywordsGroupsResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Create related keywords group',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateGroupRequest' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/GroupCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/related-keywords/groups/{id}': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get specific related keywords group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                200: { $ref: '#/components/responses/GroupDetails' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        put: {
            tags: ['Keyword Explorer'],
            summary: 'Update related keywords group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateGroupRequest' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/GroupUpdated' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        delete: {
            tags: ['Keyword Explorer'],
            summary: 'Delete related keywords group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                204: { description: 'Group deleted successfully' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/ready-keywords-for-keywords/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get ready keywords for keywords',
            description: 'Retrieve keywords ready to be processed for a given set of keywords',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/KeywordsForKeywordsParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Ready keywords retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/KeywordsResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },
    '/api/keyword-explorer/live-keywords-for-keywords/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get live keywords for keywords',
            description: 'Get real-time keywords analysis for a set of keywords',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/KeywordsForKeywordsParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Live keywords retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/KeywordsResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },
    '/api/keyword-explorer/keywords-for-site/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get keywords for site',
            description: 'Retrieve keywords associated with a specific website',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/KeywordsForSiteParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Keywords for site retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/KeywordsResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },
    '/api/keyword-explorer/keywords-for-site/groups': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get keywords for site groups',
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: '#/components/parameters/Page' },
                { $ref: '#/components/parameters/Limit' }
            ],
            responses: {
                200: { $ref: '#/components/responses/GroupsList' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Create keywords for site group',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateGroupRequest' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/GroupCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/keywords-for-site/groups/{id}': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get specific keywords for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                200: { $ref: '#/components/responses/GroupDetails' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        put: {
            tags: ['Keyword Explorer'],
            summary: 'Update keywords for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateGroupRequest' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/GroupUpdated' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        delete: {
            tags: ['Keyword Explorer'],
            summary: 'Delete keywords for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                204: { description: 'Group deleted successfully' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/keyword-for-site/groups': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get keyword for site groups (singular)',
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: '#/components/parameters/Page' },
                { $ref: '#/components/parameters/Limit' }
            ],
            responses: {
                200: { $ref: '#/components/responses/GroupsList' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Create keyword for site group',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateGroupRequest' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/GroupCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/keyword-for-site/groups/{id}': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get specific keyword for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                200: { $ref: '#/components/responses/GroupDetails' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        put: {
            tags: ['Keyword Explorer'],
            summary: 'Update keyword for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateGroupRequest' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/GroupUpdated' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        delete: {
            tags: ['Keyword Explorer'],
            summary: 'Delete keyword for site group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                204: { description: 'Group deleted successfully' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/search-volume/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get search volume data',
            description: 'Get real-time search volume data for keywords',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/SearchVolumeParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Search volume data retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SearchVolumeResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },
    '/api/keyword-explorer/search-volume/groups': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get search volume groups',
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: '#/components/parameters/Page' },
                { $ref: '#/components/parameters/Limit' }
            ],
            responses: {
                200: { $ref: '#/components/responses/GroupsList' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Create search volume group',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateGroupRequest' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/GroupCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/search-volume/groups/{id}': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get specific search volume group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                200: { $ref: '#/components/responses/GroupDetails' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        put: {
            tags: ['Keyword Explorer'],
            summary: 'Update search volume group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateGroupRequest' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/GroupUpdated' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        delete: {
            tags: ['Keyword Explorer'],
            summary: 'Delete search volume group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                204: { description: 'Group deleted successfully' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/serp-advanced/live': {
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Get advanced SERP data',
            description: 'Get detailed SERP (Search Engine Results Page) analysis',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/SerpAdvancedParams' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'SERP data retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SerpAdvancedResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },
    '/api/keyword-explorer/serp-advanced/groups': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get SERP advanced groups',
            security: [{ bearerAuth: [] }],
            parameters: [
                { $ref: '#/components/parameters/Page' },
                { $ref: '#/components/parameters/Limit' }
            ],
            responses: {
                200: { $ref: '#/components/responses/GroupsList' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        post: {
            tags: ['Keyword Explorer'],
            summary: 'Create SERP advanced group',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateGroupRequest' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/GroupCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    },
    '/api/keyword-explorer/serp-advanced/groups/{id}': {
        get: {
            tags: ['Keyword Explorer'],
            summary: 'Get specific SERP advanced group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                200: { $ref: '#/components/responses/GroupDetails' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        put: {
            tags: ['Keyword Explorer'],
            summary: 'Update SERP advanced group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateGroupRequest' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/GroupUpdated' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        },
        delete: {
            tags: ['Keyword Explorer'],
            summary: 'Delete SERP advanced group',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/GroupId' }],
            responses: {
                204: { description: 'Group deleted successfully' },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/UnauthorizedError' }
            }
        }
    }
};
