import axios from 'axios';
import { logger } from '../logger';
import { errorMonitoring } from '../errorMonitoring';

// Types d'erreurs
export enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    CLIENT_ERROR = 'CLIENT_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Interface pour les détails d'erreur
interface ErrorDetails {
    type: ErrorType;
    message: string;
    status?: number;
    url?: string;
    method?: string;
    data?: any;
    timestamp: string;
}

// Fonction pour déterminer le type d'erreur
const determineErrorType = (error: any): ErrorType => {
    if (!error.response) {
        // Erreur réseau (pas de réponse du serveur)
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return ErrorType.TIMEOUT_ERROR;
        }
        return ErrorType.NETWORK_ERROR;
    }

    const status = error.response.status;

    switch (status) {
        case 401:
            return ErrorType.AUTHENTICATION_ERROR;
        case 403:
            return ErrorType.AUTHORIZATION_ERROR;
        case 404:
            return ErrorType.NOT_FOUND_ERROR;
        case 422:
        case 400:
            return ErrorType.VALIDATION_ERROR;
        case 408:
            return ErrorType.TIMEOUT_ERROR;
        default:
            if (status >= 400 && status < 500) {
                return ErrorType.CLIENT_ERROR;
            } else if (status >= 500) {
                return ErrorType.SERVER_ERROR;
            }
            return ErrorType.UNKNOWN_ERROR;
    }
};

// Fonction pour extraire le message d'erreur
const extractErrorMessage = (error: any): string => {
    if (error.response?.data) {
        const data = error.response.data as any;

        // Tentative d'extraction du message selon différents formats d'API
        if (typeof data === 'string') {
            return data;
        }

        if (data.message) {
            return data.message;
        }

        if (data.error) {
            return typeof data.error === 'string' ? data.error : data.error.message || 'Erreur serveur';
        }

        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            return data.errors[0].message || data.errors[0];
        }
    }

    return error.message || 'Erreur inconnue';
};

// Fonction pour logger selon le type d'erreur
const logErrorByType = (errorDetails: ErrorDetails): void => {
    const { type, message, status, url, method, data, timestamp } = errorDetails;

    const logContext = {
        context: 'Global Interceptor',
        extra: {
            errorType: type,
            status,
            url,
            method: method?.toUpperCase(),
            timestamp,
            ...(data && { responseData: data })
        }
    };

    switch (type) {
        case ErrorType.NETWORK_ERROR:
            logger.error(`🌐 Erreur réseau: ${message}`, logContext);
            break;

        case ErrorType.AUTHENTICATION_ERROR:
            logger.warn(`🔐 Erreur d'authentification: ${message}`, logContext);
            break;

        case ErrorType.AUTHORIZATION_ERROR:
            logger.warn(`🚫 Accès refusé: ${message}`, logContext);
            break;

        case ErrorType.VALIDATION_ERROR:
            logger.warn(`✏️ Erreur de validation: ${message}`, logContext);
            break;

        case ErrorType.NOT_FOUND_ERROR:
            logger.info(`📭 Ressource non trouvée: ${message}`, logContext);
            break;

        case ErrorType.TIMEOUT_ERROR:
            logger.warn(`⏰ Timeout: ${message}`, logContext);
            break;

        case ErrorType.SERVER_ERROR:
            logger.error(`🚨 Erreur serveur: ${message}`, logContext);
            break;

        case ErrorType.CLIENT_ERROR:
            logger.warn(`👤 Erreur client: ${message}`, logContext);
            break;

        case ErrorType.UNKNOWN_ERROR:
        default:
            logger.error(`❓ Erreur inconnue: ${message}`, logContext);
            break;
    }
};

// Fonction pour gérer les actions spécifiques selon le type d'erreur
const handleErrorActions = (errorType: ErrorType, error: any): void => {
    switch (errorType) {
        case ErrorType.AUTHENTICATION_ERROR:
            // Rediriger vers la page de connexion ou rafraîchir le token
            if (typeof window !== 'undefined') {
                // Éviter la redirection si on est déjà sur la page de login
                if (!window.location.pathname.includes('/login')) {
                    logger.info('Redirection vers la page de connexion', {
                        context: 'Auth Handler'
                    });
                    // Effacer les tokens stockés
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    // Redirection (à adapter selon votre router)
                    window.location.href = '/login';
                }
            }
            break;

        case ErrorType.AUTHORIZATION_ERROR:
            logger.warn('Accès non autorisé à la ressource', {
                context: 'Auth Handler',
                extra: { url: error.config?.url }
            });
            break;

        case ErrorType.NETWORK_ERROR:
            // Vérifier la connectivité
            if (typeof window !== 'undefined' && !navigator.onLine) {
                logger.error('Connexion Internet perdue', {
                    context: 'Network Handler'
                });
            }
            break;

        case ErrorType.TIMEOUT_ERROR:
            logger.warn('Requête expirée - Vérifiez votre connexion', {
                context: 'Timeout Handler'
            });
            break;

        default:
            // Pas d'action spécifique
            break;
    }
};

export const globalInterceptor = (instance: typeof axios) => {
    // Intercepteur de requête pour logger les requêtes sortantes
    instance.interceptors.request.use(
        (config: any) => {
            logger.debug(`📤 Requête ${config.method?.toUpperCase()}: ${config.url}`, {
                context: 'HTTP Request',
                extra: {
                    method: config.method,
                    url: config.url,
                    headers: config.headers,
                    timestamp: new Date().toISOString()
                }
            });
            return config;
        },
        (error) => {
            logger.error('Erreur lors de la configuration de la requête', {
                context: 'Request Interceptor',
                extra: { error: error.message }
            });
            return Promise.reject(error);
        }
    );

    // Intercepteur de réponse pour logger les succès et erreurs
    instance.interceptors.response.use(
        (response: any) => {
            // Logger les réponses réussies en mode debug
            logger.debug(`📥 Réponse ${response.status} pour ${response.config.method?.toUpperCase()}: ${response.config.url}`, {
                context: 'HTTP Response',
                extra: {
                    status: response.status,
                    method: response.config.method,
                    url: response.config.url,
                    dataSize: JSON.stringify(response.data).length,
                    timestamp: new Date().toISOString()
                }
            });
            return response;
        },
        (error: any) => {
            const errorType = determineErrorType(error);
            const errorMessage = extractErrorMessage(error);

            const errorDetails: ErrorDetails = {
                type: errorType,
                message: errorMessage,
                status: error.response?.status,
                url: error.config?.url,
                method: error.config?.method,
                data: error.response?.data,
                timestamp: new Date().toISOString()
            };

            // Créer l'objet ApiError pour le monitoring
            const apiError = {
                errorType: errorType,
                errorDetails: errorDetails
            };

            // Enregistrer l'erreur dans le système de monitoring
            errorMonitoring.recordError(apiError);

            // Logger l'erreur selon son type
            logErrorByType(errorDetails);

            // Exécuter les actions spécifiques au type d'erreur
            handleErrorActions(errorType, error);

            // Ajouter le type d'erreur à l'objet error pour utilisation dans les composants
            error.errorType = errorType;
            error.errorDetails = errorDetails;

            return Promise.reject(error);
        }
    );
};

// Export des types et utilitaires pour usage externe
export type { ErrorDetails };
export { determineErrorType, extractErrorMessage };
