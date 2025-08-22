/**
 * Configuration de l'application basée sur les variables d'environnement
 * Ce fichier centralise toutes les variables d'environnement pour un accès type-safe
 */

export interface AppConfig {
    // API Configuration
    api: {
        baseUrl: string;
        endpoints: {
            auth: string;
            dashboard: string;
            keywordExplorer: string;
            urlAnalyzer: string;
            rankMonitor: string;
            taskCosts: string;
        };
        timeout: number;
        maxRetryAttempts: number;
        docsUrl: string;
    };

    // Application Configuration
    app: {
        name: string;
        version: string;
        environment: 'development' | 'staging' | 'production';
        baseUrl: string;
    };

    // Authentication Configuration
    auth: {
        tokenExpiry: number;
        tokenStorageKey: string;
        userStorageKey: string;
    };

    // UI/UX Configuration
    ui: {
        notificationDuration: number;
        defaultPageSize: number;
        searchDebounce: number;
    };

    // Feature Flags
    features: {
        keywordExplorer: boolean;
        urlAnalyzer: boolean;
        rankMonitor: boolean;
        dashboardAnalytics: boolean;
        darkMode: boolean;
    };

    // Development & Monitoring
    dev: {
        logLevel: string;
        enableDevLogs: boolean;
        enableSecurityHeaders: boolean;
    };

    // Micro Front-end Configuration
    microFrontend: {
        registryEnabled: boolean;
        registryUrl?: string;
        moduleLoadingTimeout: number;
        enableLazyLoading: boolean;
        enableModuleHotReload: boolean;
        preloadCriticalModules: boolean;
    };
}

/**
 * Configuration par défaut de l'application
 */
export const config: AppConfig = {
    api: {
        baseUrl: process.env.NODE_APP_API_BASE_URL || 'http://localhost:5100',
        endpoints: {
            auth: process.env.NODE_APP_API_AUTH_ENDPOINT || '/api/auth',
            dashboard: process.env.NODE_APP_API_DASHBOARD_ENDPOINT || '/api/dashboard',
            keywordExplorer: process.env.NODE_APP_API_KEYWORD_EXPLORER_ENDPOINT || '/api/keyword-explorer',
            urlAnalyzer: process.env.NODE_APP_API_URL_ANALYZER_ENDPOINT || '/api/url-analyzer',
            rankMonitor: process.env.NODE_APP_API_RANK_MONITOR_ENDPOINT || '/api/rank-monitor',
            taskCosts: process.env.NODE_APP_API_TASK_COSTS_ENDPOINT || '/api/task-costs',
        },
        timeout: parseInt(process.env.NODE_APP_API_TIMEOUT || '30000'),
        maxRetryAttempts: parseInt(process.env.NODE_APP_MAX_RETRY_ATTEMPTS || '3'),
        docsUrl: process.env.NODE_APP_API_DOCS_URL || 'http://localhost:3000/api-docs',
    },

    app: {
        name: process.env.NODE_APP_NAME || 'IA SEO Tool',
        version: process.env.NODE_APP_VERSION || '1.0.0',
        environment: (process.env.NODE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
        baseUrl: process.env.NODE_APP_BASE_URL || 'http://localhost:3001',
    },

    auth: {
        tokenExpiry: parseInt(process.env.NODE_APP_TOKEN_EXPIRY || '86400000'), // 24 heures par défaut
        tokenStorageKey: process.env.NODE_APP_TOKEN_STORAGE_KEY || 'ia_seo_auth_token',
        userStorageKey: process.env.NODE_APP_USER_STORAGE_KEY || 'ia_seo_user_data',
    },

    ui: {
        notificationDuration: parseInt(process.env.NODE_APP_NOTIFICATION_DURATION || '5000'),
        defaultPageSize: parseInt(process.env.NODE_APP_DEFAULT_PAGE_SIZE || '20'),
        searchDebounce: parseInt(process.env.NODE_APP_SEARCH_DEBOUNCE || '500'),
    },

    features: {
        keywordExplorer: process.env.NODE_APP_ENABLE_KEYWORD_EXPLORER === 'true',
        urlAnalyzer: process.env.NODE_APP_ENABLE_URL_ANALYZER === 'true',
        rankMonitor: process.env.NODE_APP_ENABLE_RANK_MONITOR === 'true',
        dashboardAnalytics: process.env.NODE_APP_ENABLE_DASHBOARD_ANALYTICS === 'true',
        darkMode: process.env.NODE_APP_ENABLE_DARK_MODE === 'true',
    },

    dev: {
        logLevel: process.env.NODE_APP_LOG_LEVEL || 'info',
        enableDevLogs: process.env.NODE_APP_ENABLE_DEV_LOGS === 'true',
        enableSecurityHeaders: process.env.NODE_APP_ENABLE_SECURITY_HEADERS === 'true',
    },

    microFrontend: {
        registryEnabled: process.env.NODE_APP_MODULE_REGISTRY_ENABLED === 'true',
        registryUrl: process.env.NODE_APP_MODULE_REGISTRY_URL,
        moduleLoadingTimeout: parseInt(process.env.NODE_APP_MODULE_LOADING_TIMEOUT || '10000'),
        enableLazyLoading: process.env.NODE_APP_ENABLE_LAZY_LOADING === 'true',
        enableModuleHotReload: process.env.NODE_APP_ENABLE_MODULE_HOT_RELOAD === 'true',
        preloadCriticalModules: process.env.NODE_APP_PRELOAD_CRITICAL_MODULES === 'true',
    },
};

/**
 * Validation de la configuration au démarrage de l'application
 */
export const validateConfig = (): void => {
    const requiredVars = [
        'NODE_APP_API_BASE_URL',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
    }

    // Validation des URLs
    try {
        new URL(config.api.baseUrl);
        new URL(config.app.baseUrl);
        new URL(config.api.docsUrl);
    } catch (error) {
        throw new Error('URLs invalides dans la configuration');
    }

    console.log('✅ Configuration validée avec succès');
    console.log(`📱 Application: ${config.app.name} v${config.app.version}`);
    console.log(`🌍 Environnement: ${config.app.environment}`);
    console.log(`🔗 API Backend: ${config.api.baseUrl}`);
};

export default config;
