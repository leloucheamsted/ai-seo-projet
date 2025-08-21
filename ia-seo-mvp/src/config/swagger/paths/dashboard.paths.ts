export const dashboardPaths = {
    '/api/dashboard/stats': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir les statistiques complètes du dashboard',
            description: 'Récupère toutes les statistiques pour le dashboard utilisateur',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Statistiques récupérées avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/DashboardStats' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/overview': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir l\'aperçu des statistiques principales',
            description: 'Récupère un aperçu des statistiques principales du dashboard',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Aperçu récupéré avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/DashboardOverview' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/tasks-by-type': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir le nombre de tâches par type',
            description: 'Récupère le nombre de tâches groupées par type',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Statistiques des tâches récupérées avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/TasksByType' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/costs-by-type': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir les coûts par type de tâche',
            description: 'Récupère les coûts groupés par type de tâche',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Coûts par type récupérés avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CostsByType' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/recent-activity': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir l\'activité récente',
            description: 'Récupère l\'activité récente de l\'utilisateur',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Activité récente récupérée avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RecentActivity' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/monthly-trend': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir la tendance mensuelle',
            description: 'Récupère la tendance mensuelle des utilisations et coûts',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Tendance mensuelle récupérée avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MonthlyTrend' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/top-endpoints': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir les endpoints les plus utilisés',
            description: 'Récupère les endpoints les plus utilisés avec leurs statistiques',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Top endpoints récupérés avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/TopEndpoints' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/cache/refresh': {
        post: {
            tags: ['Dashboard'],
            summary: 'Actualiser le cache du dashboard',
            description: 'Force l\'actualisation du cache des statistiques du dashboard',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Cache actualisé avec succès',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Cache refreshed successfully' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },
    '/api/dashboard/cache': {
        get: {
            tags: ['Dashboard'],
            summary: 'Obtenir les statistiques en cache',
            description: 'Récupère les statistiques mises en cache du dashboard',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Statistiques en cache récupérées avec succès',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CachedStats' }
                        }
                    }
                },
                401: {
                    description: 'Non autorisé',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Aucune donnée en cache disponible',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Erreur serveur',
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
