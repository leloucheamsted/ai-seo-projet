
import axios from 'axios';
import { storage } from '../storage';
import { ACCESS_TOKEN_KEY } from '../../constants/auth';

export interface AuthInterceptorConfig {
    skipAuth?: boolean;
}

export const authInterceptor = (instance: any) => {
    instance.interceptors.request.use(
        (config: any) => {
            // Vérifier si on doit ignorer l'authentification pour cette requête
            const customConfig = config as AuthInterceptorConfig;

            if (!customConfig.skipAuth) {
                // Récupère le token depuis le storage
                const token = storage.get<string>(ACCESS_TOKEN_KEY);
                if (token && config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }

            return config;
        },
        (error: any) => Promise.reject(error)
    );
};
