import axios from 'axios';
import { config } from '../../config/app.config';
import { authInterceptor } from './interceptor/auth.interceptor';
import { storage } from './storage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/auth';

// Types personnalisés pour remplacer ceux d'Axios
export interface HttpClientConfig {
    skipAuth?: boolean;
    retryCount?: number;
    showNotification?: boolean;
    timeout?: number;
    headers?: Record<string, string>;
    onUploadProgress?: (progressEvent: any) => void;
    params?: Record<string, any>;
}

/**
 * Interface pour les réponses API standardisées
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Interface pour les erreurs API
 */
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: any;
}

/**
 * Classe Axios globale pour toutes les requêtes HTTP de l'application
 * Utilise la configuration centralisée et gère l'authentification, les erreurs et les retries
 */
export class HttpClient {
    private axiosInstance: any;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value: any) => void;
        reject: (error: any) => void;
    }> = [];

    constructor() {
        // Création de l'instance Axios avec la configuration globale
        this.axiosInstance = axios.create({
            baseURL: config.api.baseUrl,
            timeout: config.api.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        // Appliquer l'intercepteur d'authentification
        authInterceptor(this.axiosInstance);

        this.setupInterceptors();
        this.logConfiguration();
    }

    /**
     * Configuration des logs au démarrage
     */
    private logConfiguration(): void {
        if (config.dev.enableDevLogs) {
            console.log('🌐 HttpClient initialized:', {
                baseURL: config.api.baseUrl,
                timeout: config.api.timeout,
                environment: config.app.environment,
                maxRetryAttempts: config.api.maxRetryAttempts,
            });
        }
    }

    /**
     * Configuration des intercepteurs de requête et de réponse
     * Note: L'authentification est gérée par authInterceptor
     */
    private setupInterceptors(): void {
        // Intercepteur de requête pour les headers de sécurité et le logging
        this.axiosInstance.interceptors.request.use(
            (axiosConfig: any) => {
                // Headers de sécurité si activés
                if (axiosConfig.headers && this.shouldAddSecurityHeaders()) {
                    axiosConfig.headers['X-Frame-Options'] = 'DENY';
                    axiosConfig.headers['X-Content-Type-Options'] = 'nosniff';
                    axiosConfig.headers['X-XSS-Protection'] = '1; mode=block';
                }

                // Logging des requêtes en développement
                if (config.dev.enableDevLogs && config.app.environment === 'development') {
                    console.log('📤 HTTP Request:', {
                        method: axiosConfig.method?.toUpperCase(),
                        url: axiosConfig.url,
                        baseURL: axiosConfig.baseURL,
                        data: axiosConfig.data,
                        params: axiosConfig.params,
                    });
                }

                return axiosConfig;
            },
            (error: any) => {
                if (config.dev.enableDevLogs) {
                    console.error('❌ Request Error:', error);
                }
                return Promise.reject(error);
            }
        );

        // Intercepteur de réponse
        this.axiosInstance.interceptors.response.use(
            (response: any) => {
                // Logging des réponses en développement
                if (config.dev.enableDevLogs && config.app.environment === 'development') {
                    console.log('📥 HTTP Response:', {
                        status: response.status,
                        url: response.config.url,
                        data: response.data,
                    });
                }

                return response;
            },
            async (error: any) => {
                const originalRequest = error.config as HttpClientConfig & any & { _retry?: boolean };

                // Gestion des erreurs 401 (Unauthorized)
                if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
                    if (this.isRefreshing) {
                        // Si on est déjà en train de rafraîchir, ajouter à la queue
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const newToken = await this.refreshAuthToken();
                        if (newToken && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }

                        // Traiter toutes les requêtes en attente
                        this.processQueue(null, newToken);
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.processQueue(refreshError, null);
                        this.handleAuthError();
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                // Retry automatique pour les erreurs réseau ou 5xx
                if (this.shouldRetry(error, originalRequest)) {
                    return this.retryRequest(originalRequest);
                }

                // Logging des erreurs
                if (config.dev.enableDevLogs) {
                    console.error('❌ HTTP Error:', {
                        status: error.response?.status,
                        message: error.message,
                        url: error.config?.url,
                        data: error.response?.data,
                    });
                }

                // Standardiser les erreurs
                return Promise.reject(this.normalizeError(error));
            }
        );
    }

    /**
     * Traiter la queue des requêtes en attente après refresh du token
     */
    private processQueue(error: any, token: string | null): void {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });

        this.failedQueue = [];
    }

    /**
     * Vérifier si on doit ajouter les headers de sécurité
     */
    private shouldAddSecurityHeaders(): boolean {
        return config.dev.enableSecurityHeaders && config.app.environment === 'production';
    }

    /**
     * Récupérer le token d'authentification
     */
    private getAuthToken(): string | null {
        // Utiliser le service de stockage et les constantes appropriées
        return storage.get<string>(ACCESS_TOKEN_KEY) ||
            localStorage.getItem(config.auth.tokenStorageKey) ||
            localStorage.getItem('authToken'); // Fallback pour la compatibilité
    }

    /**
     * Rafraîchir le token d'authentification
     */
    private async refreshAuthToken(): Promise<string | null> {
        try {
            // Utiliser les constantes appropriées
            const refreshToken = storage.get<string>(REFRESH_TOKEN_KEY) || localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await this.axiosInstance.post(
                `${config.api.endpoints.auth}/refresh`,
                { refreshToken },
                { skipAuth: true }
            );

            if (response.data.success && response.data.tokens) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

                // Utiliser le service de stockage et les constantes appropriées
                storage.set(ACCESS_TOKEN_KEY, accessToken);
                storage.set(REFRESH_TOKEN_KEY, newRefreshToken);

                // Fallback pour la compatibilité
                localStorage.setItem(config.auth.tokenStorageKey, accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                return accessToken;
            }

            throw new Error('Token refresh failed');
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    }

    /**
     * Gérer les erreurs d'authentification
     */
    private handleAuthError(): void {
        // Nettoyer les données d'authentification avec les nouvelles constantes
        storage.remove(ACCESS_TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        storage.remove(config.auth.userStorageKey);

        // Fallback pour la compatibilité
        localStorage.removeItem(config.auth.tokenStorageKey);
        localStorage.removeItem(config.auth.userStorageKey);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Rediriger vers la page de connexion si on n'y est pas déjà
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    /**
     * Vérifier si une requête doit être retentée
     */
    private shouldRetry(error: any, originalRequest?: HttpClientConfig & any): boolean {
        if (!originalRequest) return false;

        const retryCount = originalRequest.retryCount || 0;
        const maxRetries = config.api.maxRetryAttempts;

        // Ne pas retry les erreurs 4xx (sauf 401 qui est géré séparément)
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            return false;
        }

        // Retry pour les erreurs réseau ou 5xx
        return retryCount < maxRetries;
    }

    /**
     * Retenter une requête
     */
    private async retryRequest(originalRequest: HttpClientConfig & any): Promise<any> {
        const retryCount = (originalRequest.retryCount || 0) + 1;
        const delay = Math.pow(2, retryCount) * 1000; // Backoff exponentiel

        if (config.dev.enableDevLogs) {
            console.log(`🔄 Retrying request (${retryCount}/${config.api.maxRetryAttempts}) in ${delay}ms:`, originalRequest.url);
        }

        // Attendre avant de retry
        await new Promise(resolve => setTimeout(resolve, delay));

        // Mettre à jour le compteur de retry
        originalRequest.retryCount = retryCount;

        return this.axiosInstance(originalRequest);
    }

    /**
     * Normaliser les erreurs pour un format cohérent
     */
    private normalizeError(error: any): ApiError {
        const apiError: ApiError = {
            message: 'Une erreur est survenue',
            status: error.response?.status,
        };

        if (error.response?.data && typeof error.response.data === 'object') {
            const errorData = error.response.data as any;
            apiError.message = errorData.message || errorData.error || apiError.message;
            apiError.code = errorData.code;
            apiError.details = errorData.details;
        } else if (error.message) {
            apiError.message = error.message;
        }

        // Messages d'erreur spécifiques selon le status
        switch (error.response?.status) {
            case 400:
                apiError.message = apiError.message || 'Requête invalide';
                break;
            case 401:
                apiError.message = 'Authentification requise';
                break;
            case 403:
                apiError.message = 'Accès interdit';
                break;
            case 404:
                apiError.message = 'Ressource non trouvée';
                break;
            case 409:
                apiError.message = apiError.message || 'Conflit de données';
                break;
            case 429:
                apiError.message = 'Trop de requêtes';
                break;
            case 500:
                apiError.message = 'Erreur serveur interne';
                break;
            case 502:
                apiError.message = 'Service temporairement indisponible';
                break;
            case 503:
                apiError.message = 'Service en maintenance';
                break;
            default:
                if (!error.response) {
                    apiError.message = 'Erreur de connexion réseau';
                }
        }

        return apiError;
    }

    /**
     * Méthodes HTTP publiques
     */

    /**
     * Requête GET
     */
    public async get<T = any>(url: string, httpConfig?: HttpClientConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.get(url, httpConfig);
        return response.data;
    }

    /**
     * Requête POST
     */
    public async post<T = any>(url: string, data?: any, httpConfig?: HttpClientConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.post(url, data, httpConfig);
        return response.data;
    }

    /**
     * Requête PUT
     */
    public async put<T = any>(url: string, data?: any, httpConfig?: HttpClientConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.put(url, data, httpConfig);
        return response.data;
    }

    /**
     * Requête PATCH
     */
    public async patch<T = any>(url: string, data?: any, httpConfig?: HttpClientConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.patch(url, data, httpConfig);
        return response.data;
    }

    /**
     * Requête DELETE
     */
    public async delete<T = any>(url: string, httpConfig?: HttpClientConfig): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.delete(url, httpConfig);
        return response.data;
    }

    /**
     * Upload de fichier
     */
    public async upload<T = any>(
        url: string,
        file: File | FormData,
        onProgress?: (progressEvent: any) => void,
        httpConfig?: HttpClientConfig
    ): Promise<ApiResponse<T>> {
        const formData = file instanceof FormData ? file : new FormData();
        if (file instanceof File) {
            formData.append('file', file);
        }

        const uploadConfig: HttpClientConfig = {
            ...httpConfig,
            headers: {
                ...httpConfig?.headers,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress,
        };

        const response = await this.axiosInstance.post(url, formData, uploadConfig);
        return response.data;
    }

    /**
     * Requête avec gestion de pagination
     */
    public async paginated<T = any>(
        url: string,
        params?: { page?: number; limit?: number;[key: string]: any },
        httpConfig?: HttpClientConfig
    ): Promise<ApiResponse<T[]>> {
        const paginationParams = {
            page: params?.page || 1,
            limit: params?.limit || config.ui.defaultPageSize,
            ...params,
        };

        const response = await this.axiosInstance.get(url, {
            ...httpConfig,
            params: paginationParams,
        });

        return response.data;
    }

    /**
     * Méthodes utilitaires
     */

    /**
     * Obtenir l'instance Axios brute (à utiliser avec précaution)
     */
    public getAxiosInstance(): any {
        return this.axiosInstance;
    }

    /**
     * Mettre à jour la baseURL dynamiquement
     */
    public setBaseURL(baseURL: string): void {
        this.axiosInstance.defaults.baseURL = baseURL;
        if (config.dev.enableDevLogs) {
            console.log('🔄 HttpClient baseURL updated:', baseURL);
        }
    }

    /**
     * Ajouter un header global
     */
    public setGlobalHeader(name: string, value: string): void {
        this.axiosInstance.defaults.headers.common[name] = value;
    }

    /**
     * Supprimer un header global
     */
    public removeGlobalHeader(name: string): void {
        delete this.axiosInstance.defaults.headers.common[name];
    }

    /**
     * Vérifier l'état de santé de l'API
     */
    public async healthCheck(): Promise<boolean> {
        try {
            await this.get('/health', { skipAuth: true, timeout: 5000 });
            return true;
        } catch (error) {
            console.error('API Health Check failed:', error);
            return false;
        }
    }
}

// Instance singleton du client HTTP
export const httpClient = new HttpClient();

// Export par défaut
export default httpClient;
