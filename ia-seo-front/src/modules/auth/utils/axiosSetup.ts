import axios from 'axios';
import { authService } from '../services/authService';

/**
 * Configuration des intercepteurs Axios pour gérer l'authentification globalement
 */
export const setupAxiosInterceptors = () => {
    // Intercepteur de requête pour ajouter le token d'authentification
    axios.interceptors.request.use(
        (config) => {
            const token = authService.getAccessToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Intercepteur de réponse pour gérer le refresh token
    axios.interceptors.response.use(
        (response) => response,
        async (error: any) => {
            const originalRequest = error.config as any;

            // Si le token a expiré (401) et qu'on n'est pas déjà en train de rafraîchir
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const response = await authService.refreshToken(refreshToken);
                        localStorage.setItem('authToken', response.tokens.accessToken);
                        localStorage.setItem('refreshToken', response.tokens.refreshToken);

                        // Retry la requête originale avec le nouveau token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response.tokens.accessToken}`;
                        }
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    // Si le refresh échoue, déconnecter l'utilisateur
                    authService.clearAuthData();
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );
};
