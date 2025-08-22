import { ErrorHandlingConfig } from '../types/error.types';

/**
 * Configuration par défaut pour la gestion d'erreurs
 */
export const defaultErrorConfig: ErrorHandlingConfig = {
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 1000,
    showNotifications: true,
    logLevel: 'error',
    enableAutoLogout: true,
    enableOfflineMode: false
};

/**
 * Configuration pour les environnements de développement
 */
export const developmentErrorConfig: Partial<ErrorHandlingConfig> = {
    logLevel: 'debug',
    showNotifications: true,
    enableRetry: true,
    maxRetries: 2,
    retryDelay: 500, // Plus rapide en dev
    enableAutoLogout: false,
    enableOfflineMode: true
};

/**
 * Configuration pour l'environnement de production
 */
export const productionErrorConfig: Partial<ErrorHandlingConfig> = {
    logLevel: 'error', // Logs côté serveur uniquement
    showNotifications: true,
    enableRetry: true,
    maxRetries: 3,
    retryDelay: 2000,
    enableAutoLogout: true,
    enableOfflineMode: false
};

/**
 * Configuration pour les tests
 */
export const testErrorConfig: Partial<ErrorHandlingConfig> = {
    logLevel: 'warn',
    showNotifications: false,
    enableRetry: false,
    maxRetries: 0,
    enableAutoLogout: false,
    enableOfflineMode: false
};

/**
 * Fonction pour récupérer la configuration selon l'environnement
 */
export const getErrorConfig = (): ErrorHandlingConfig => {
    const env = process.env.NODE_ENV;

    let envConfig: Partial<ErrorHandlingConfig> = {};

    switch (env) {
        case 'development':
            envConfig = developmentErrorConfig;
            break;
        case 'production':
            envConfig = productionErrorConfig;
            break;
        case 'test':
            envConfig = testErrorConfig;
            break;
        default:
            envConfig = developmentErrorConfig;
    }

    return {
        ...defaultErrorConfig,
        ...envConfig
    };
};

/**
 * Messages d'erreur personnalisés pour l'utilisateur final
 */
export const userFriendlyMessages = {
    NETWORK_ERROR: "Problème de connexion réseau. Vérifiez votre connexion internet.",
    TIMEOUT_ERROR: "La requête a pris trop de temps. Veuillez réessayer.",
    SERVER_ERROR: "Erreur du serveur. Notre équipe technique a été notifiée.",
    RATE_LIMIT_ERROR: "Trop de requêtes simultanées. Veuillez patienter un moment.",
    API_LIMIT_ERROR: "Limite d'utilisation API atteinte. Contactez le support.",
    AUTHENTICATION_ERROR: "Votre session a expiré. Veuillez vous reconnecter.",
    PERMISSION_ERROR: "Vous n'avez pas les permissions nécessaires pour cette action.",
    VALIDATION_ERROR: "Veuillez vérifier les informations saisies.",
    UNKNOWN_ERROR: "Une erreur inattendue s'est produite. Veuillez réessayer."
};

/**
 * Actions de récupération suggérées pour chaque type d'erreur
 */
export const recoveryActions = {
    NETWORK_ERROR: [
        { label: 'Vérifier la connexion', action: 'checkConnection' },
        { label: 'Recharger', action: 'reload' }
    ],
    TIMEOUT_ERROR: [
        { label: 'Réessayer', action: 'retry' }
    ],
    SERVER_ERROR: [
        { label: 'Signaler le problème', action: 'report' },
        { label: 'Recharger', action: 'reload' }
    ],
    RATE_LIMIT_ERROR: [
        { label: 'Attendre', action: 'wait' }
    ],
    API_LIMIT_ERROR: [
        { label: 'Contacter le support', action: 'contact' }
    ],
    AUTHENTICATION_ERROR: [
        { label: 'Se reconnecter', action: 'login' }
    ],
    PERMISSION_ERROR: [
        { label: 'Contacter l\'admin', action: 'contact' }
    ],
    VALIDATION_ERROR: [
        { label: 'Corriger', action: 'edit' }
    ],
    UNKNOWN_ERROR: [
        { label: 'Réessayer', action: 'retry' },
        { label: 'Recharger', action: 'reload' }
    ]
};
