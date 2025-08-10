
import axios from 'axios';
import { storage } from '../storage';
import { ACCESS_TOKEN_KEY } from '../../constants/auth';

export const authInterceptor = (instance: typeof axios) => {
    instance.interceptors.request.use(
        (config) => {
            // Récupère le token depuis le localStorage (ou cookies)
            const token = storage.get<string>(ACCESS_TOKEN_KEY);
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};
