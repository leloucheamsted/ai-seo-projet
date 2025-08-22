import { httpClient } from '../../../shared/services/HttpClient';
import { config } from '../../../config/app.config';
import { storage } from '../../../shared/services/storage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, USER_KEY } from '../../../shared/constants/auth';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User
} from '../types/auth.types';

export const authService = {
    /**
     * Connexion d'un utilisateur
     */
    login: async (loginData: LoginRequest): Promise<AuthResponse> => {
        const response = await httpClient.post<AuthResponse>(
            `${config.api.endpoints.auth}/login`,
            loginData,
            { skipAuth: true } // Skip auth pour la page de login
        );

        // Stocker les tokens et les informations utilisateur
        if (response.success && response.data) {
            // Utiliser le service de stockage et les constantes appropriées
            storage.set(ACCESS_TOKEN_KEY, response.data.tokens.accessToken);
            storage.set(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
            storage.set(config.auth.userStorageKey, response.data.user);

            // Fallback pour la compatibilité avec les anciennes clés
            localStorage.setItem(config.auth.tokenStorageKey, response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
            localStorage.setItem(config.auth.userStorageKey, JSON.stringify(response.data.user));
            return response.data;
        }

        return response as AuthResponse;
    },

    /**
     * Inscription d'un nouvel utilisateur
     */
    register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
        const response = await httpClient.post<AuthResponse>(
            `${config.api.endpoints.auth}/register`,
            registerData,
            { skipAuth: true } // Skip auth pour la page d'inscription
        );

        // Stocker les tokens et les informations utilisateur
        if (response.success && response.data) {
            // Utiliser le service de stockage et les constantes appropriées
            storage.set(ACCESS_TOKEN_KEY, response.data.tokens.accessToken);
            storage.set(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
            storage.set(config.auth.userStorageKey, response.data.user);

            // Fallback pour la compatibilité avec les anciennes clés
            localStorage.setItem(config.auth.tokenStorageKey, response.data.tokens.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
            localStorage.setItem(config.auth.userStorageKey, JSON.stringify(response.data.user));
            return response.data;
        }

        return response as AuthResponse;
    },    /**
     * Renouvellement du token d'accès
     */
    refreshToken: async (refreshToken: string): Promise<{ success: boolean; tokens: { accessToken: string; refreshToken: string } }> => {
        const response = await httpClient.post<{ success: boolean; tokens: { accessToken: string; refreshToken: string } }>(
            `${config.api.endpoints.auth}/refresh`,
            { refreshToken },
            { skipAuth: true } // Skip auth car on renouvelle le token
        );

        if (response.success && response.data?.tokens) {
            // Utiliser le service de stockage et les constantes appropriées
            storage.set(ACCESS_TOKEN_KEY, response.data.tokens.accessToken);
            storage.set(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);

            // Fallback pour la compatibilité
            localStorage.setItem(config.auth.tokenStorageKey, response.data.tokens.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.tokens.refreshToken);
        }

        return response.data || { success: false, tokens: { accessToken: '', refreshToken: '' } };
    },

    /**
     * Récupération du profil utilisateur
     */
    getProfile: async (): Promise<{ success: boolean; user: User }> => {
        const response = await httpClient.get<{ success: boolean; user: User }>(
            `${config.api.endpoints.auth}/me`
        );

        return response.data || { success: false, user: {} as User };
    },

    /**
     * Déconnexion
     */
    logout: async (): Promise<void> => {
        try {
            await httpClient.post(`${config.api.endpoints.auth}/logout`);
        } catch (error) {
            console.warn('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le stockage local même si la requête échoue
            storage.remove(ACCESS_TOKEN_KEY);
            storage.remove(REFRESH_TOKEN_KEY);
            storage.remove(config.auth.userStorageKey);

            // Fallback pour la compatibilité
            localStorage.removeItem(config.auth.tokenStorageKey);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(config.auth.userStorageKey);
        }
    },

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated: (): boolean => {
        // Utiliser les constantes appropriées
        const token = storage.get<string>(ACCESS_TOKEN_KEY) || localStorage.getItem(config.auth.tokenStorageKey);
        const user = storage.get(config.auth.userStorageKey) || localStorage.getItem(config.auth.userStorageKey);
        return !!(token && user);
    },

    /**
     * Récupérer l'utilisateur depuis le stockage local
     */
    getCurrentUser: (): User | null => {
        try {
            // Priorité au nouveau service de stockage
            let user = storage.get<User>(config.auth.userStorageKey);
            if (!user) {
                // Fallback pour la compatibilité
                const userStr = localStorage.getItem(config.auth.userStorageKey);
                user = userStr ? JSON.parse(userStr) : null;
            }
            return user;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return null;
        }
    },

    /**
     * Récupérer le token d'accès depuis le stockage local
     */
    getAccessToken: (): string | null => {
        // Utiliser les constantes appropriées avec fallback
        return storage.get<string>(ACCESS_TOKEN_KEY) || localStorage.getItem(config.auth.tokenStorageKey);
    },

    /**
     * Nettoyer toutes les données d'authentification
     */
    clearAuthData: (): void => {
        // Nettoyer avec les nouvelles constantes
        storage.remove(ACCESS_TOKEN_KEY);
        storage.remove(REFRESH_TOKEN_KEY);
        storage.remove(config.auth.userStorageKey);

        // Fallback pour la compatibilité
        localStorage.removeItem(config.auth.tokenStorageKey);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(config.auth.userStorageKey);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Sauvegarder la page de redirection après login
     */
    setRedirectPath: (path: string): void => {
        if (path && path !== '/login' && path !== '/register') {
            localStorage.setItem('redirectAfterLogin', path);
        }
    },

    /**
     * Récupérer et supprimer le chemin de redirection
     */
    getAndClearRedirectPath: (): string | null => {
        const path = localStorage.getItem('redirectAfterLogin');
        if (path) {
            localStorage.removeItem('redirectAfterLogin');
            return path;
        }
        return null;
    },

    /**
     * Vérification rapide de l'existence d'un token (sans validation côté serveur)
     */
    hasToken: (): boolean => {
        const newToken = storage.get<string>(ACCESS_TOKEN_KEY);
        const legacyToken = localStorage.getItem(config.auth.tokenStorageKey) ||
            localStorage.getItem('authToken');
        return !!(newToken || legacyToken);
    },

    /**
     * Forcer la déconnexion et rediriger vers login
     */
    forceLogout: (reason?: string): void => {
        console.log('🚪 Déconnexion forcée:', reason || 'Token invalide');

        // Nettoyer toutes les données
        authService.clearAuthData();

        // Sauvegarder la page actuelle pour redirection après reconnexion
        const currentPath = window.location.pathname + window.location.search;
        authService.setRedirectPath(currentPath);

        // Rediriger vers login
        window.location.href = '/login';
    }
};
