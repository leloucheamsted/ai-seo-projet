// Types pour la gestion d'erreurs globales
export interface ApiError {
    errorType: string;
    errorDetails: {
        type: string;
        message: string;
        status?: number;
        url?: string;
        method?: string;
        data?: any;
        timestamp: string;
    };
}

// Types pour les notifications d'erreur
export interface ErrorNotification {
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    duration?: number;
    actions?: Array<{
        label: string;
        action: () => void;
    }>;
}

// Configuration pour la gestion d'erreurs
export interface ErrorHandlingConfig {
    enableRetry: boolean;
    maxRetries: number;
    retryDelay: number;
    showNotifications: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    enableAutoLogout: boolean;
    enableOfflineMode: boolean;
}

// Types pour les actions de récupération d'erreur
export interface ErrorRecoveryAction {
    type: 'retry' | 'logout' | 'refresh' | 'redirect' | 'ignore';
    config?: {
        redirectTo?: string;
        retryDelay?: number;
        maxRetries?: number;
    };
}

export default {};
