/**
 * Exemple d'utilisation des intercepteurs d'authentification
 * Montre comment utiliser le httpClient avec l'authentification automatique
 */

import { httpClient, publicHttpClient, createHttpClient } from '../shared/services/httpClientFactory';
import { config } from '../config/app.config';

/**
 * Service exemple pour les mots-clés
 * Utilise automatiquement l'intercepteur d'authentification
 */
export const keywordService = {
    // Cette requête utilisera automatiquement le token d'authentification
    getAllKeywords: async () => {
        const response = await httpClient.get(`${config.api.endpoints.keywordExplorer}/keywords`);
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification
    createKeyword: async (keywordData: any) => {
        const response = await httpClient.post(`${config.api.endpoints.keywordExplorer}/keywords`, keywordData);
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification
    updateKeyword: async (id: string, keywordData: any) => {
        const response = await httpClient.put(`${config.api.endpoints.keywordExplorer}/keywords/${id}`, keywordData);
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification
    deleteKeyword: async (id: string) => {
        const response = await httpClient.delete(`${config.api.endpoints.keywordExplorer}/keywords/${id}`);
        return response.data;
    }
};

/**
 * Service exemple pour l'authentification
 * Utilise publicHttpClient pour éviter l'intercepteur d'auth sur login/register
 */
export const exampleAuthService = {
    // Cette requête n'utilisera PAS le token d'authentification (publicHttpClient)
    login: async (credentials: { email: string; password: string }) => {
        const response = await publicHttpClient.post(`${config.api.endpoints.auth}/login`, credentials);
        return response.data;
    },

    // Cette requête n'utilisera PAS le token d'authentification (publicHttpClient)
    register: async (userData: any) => {
        const response = await publicHttpClient.post(`${config.api.endpoints.auth}/register`, userData);
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification (httpClient)
    getProfile: async () => {
        const response = await httpClient.get(`${config.api.endpoints.auth}/me`);
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification (httpClient)
    updateProfile: async (profileData: any) => {
        const response = await httpClient.put(`${config.api.endpoints.auth}/me`, profileData);
        return response.data;
    }
};

/**
 * Service exemple pour les analyses d'URL
 * Utilise un client personnalisé avec configuration spécifique
 */
export const urlAnalyzerService = {
    // Créer un client spécialisé pour l'analyse d'URL avec timeout plus long
    client: createHttpClient({
        timeout: 60000, // 60 secondes pour les analyses longues
        customHeaders: {
            'X-Service': 'URL-Analyzer'
        }
    }),

    // Cette requête utilisera automatiquement le token d'authentification avec le client personnalisé
    analyzeUrl: async (url: string) => {
        const response = await urlAnalyzerService.client.post(`${config.api.endpoints.urlAnalyzer}/analyze`, { url });
        return response.data;
    },

    // Cette requête utilisera automatiquement le token d'authentification avec le client personnalisé
    getAnalysisHistory: async () => {
        const response = await urlAnalyzerService.client.get(`${config.api.endpoints.urlAnalyzer}/history`);
        return response.data;
    }
};

/**
 * Utilisation directe de httpClient pour des requêtes ponctuelles
 */
export const makeAuthenticatedRequest = async () => {
    try {
        // Cette requête utilisera automatiquement le token d'authentification
        const dashboardData = await httpClient.get(`${config.api.endpoints.dashboard}/stats`);
        console.log('Dashboard data:', dashboardData.data);

        // Cette requête utilisera automatiquement le token d'authentification
        const taskCosts = await httpClient.get(`${config.api.endpoints.taskCosts}`);
        console.log('Task costs:', taskCosts.data);

    } catch (error) {
        console.error('Erreur lors des requêtes authentifiées:', error);

        // Si erreur 401, l'intercepteur gérera automatiquement le refresh du token
        // et retentera la requête avec le nouveau token
    }
};

/**
 * Utilisation de publicHttpClient pour des requêtes publiques
 */
export const makePublicRequest = async () => {
    try {
        // Ces requêtes n'utiliseront PAS le token d'authentification
        const publicData = await publicHttpClient.get('/api/public/stats');
        console.log('Public data:', publicData.data);

        const healthCheck = await publicHttpClient.get('/api/health');
        console.log('Health check:', healthCheck.data);

    } catch (error) {
        console.error('Erreur lors des requêtes publiques:', error);
    }
};
