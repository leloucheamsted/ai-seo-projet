import axios from 'axios';
import { logger } from '../logger';

export const globalInterceptor = (instance: typeof axios) => {
    // Réponse
    instance.interceptors.response.use(
        (response) => response,
        (error: any) => {
            // Log l'erreur
            logger.error('API Error', {
                context: 'Axios',
                extra: {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    data: error.response?.data,
                }
            });
            // Affiche une notification ou gère globalement l'erreur ici si besoin
            return Promise.reject(error);
        }
    );
};
