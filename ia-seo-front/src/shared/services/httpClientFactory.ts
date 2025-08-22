/**
 * Factory pour créer des instances HTTP avec l'intercepteur d'authentification
 * Assure que tous les clients HTTP de l'application utilisent l'intercepteur d'auth
 */

import axios from 'axios';
import { authInterceptor } from './interceptor/auth.interceptor';
import { config } from '../../config/app.config';

export interface HttpClientFactoryConfig {
    baseURL?: string;
    timeout?: number;
    skipAuthInterceptor?: boolean;
    customHeaders?: Record<string, string>;
}

/**
 * Créer une instance HTTP avec l'intercepteur d'authentification
 */
export const createHttpClient = (factoryConfig?: HttpClientFactoryConfig) => {
    const instance = axios.create({
        baseURL: factoryConfig?.baseURL || config.api.baseUrl,
        timeout: factoryConfig?.timeout || config.api.timeout,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...factoryConfig?.customHeaders,
        },
    });

    // Appliquer l'intercepteur d'authentification sauf si explicitement désactivé
    if (!factoryConfig?.skipAuthInterceptor) {
        authInterceptor(instance);
    }

    // Logging en développement
    if (config.dev.enableDevLogs) {
        console.log('🌐 HTTP Client created:', {
            baseURL: instance.defaults.baseURL,
            timeout: instance.defaults.timeout,
            authInterceptor: !factoryConfig?.skipAuthInterceptor,
        });
    }

    return instance;
};

/**
 * Instance HTTP par défaut avec intercepteur d'authentification
 */
export const httpClient = createHttpClient();

/**
 * Instance HTTP publique sans authentification (pour login, register, etc.)
 */
export const publicHttpClient = createHttpClient({
    skipAuthInterceptor: true
});

export default { createHttpClient, httpClient, publicHttpClient };
