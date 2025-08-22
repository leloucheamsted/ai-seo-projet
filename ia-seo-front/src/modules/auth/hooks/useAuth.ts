import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authService } from '../services/authService';
import {
    User,
    AuthState,
    LoginFormData,
    RegisterFormData,
    AuthError
} from '../types/auth.types';

const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
};

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);
    const navigate = useNavigate();

    // Initialiser l'état d'authentification au chargement
    useEffect(() => {
        const initializeAuth = () => {
            const isAuthenticated = authService.isAuthenticated();
            const user = authService.getCurrentUser();
            const accessToken = authService.getAccessToken();

            if (isAuthenticated && user && accessToken) {
                setAuthState({
                    isAuthenticated: true,
                    user,
                    tokens: {
                        accessToken,
                        refreshToken: localStorage.getItem('refreshToken') || '',
                    },
                    isLoading: false,
                    error: null,
                });
            } else {
                // Si les données sont incohérentes, nettoyer
                authService.clearAuthData();
            }
        };

        initializeAuth();
    }, []);

    // Fonction de connexion
    const login = useCallback(async (loginData: LoginFormData): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.login(loginData);

            if (response.success) {
                setAuthState({
                    isAuthenticated: true,
                    user: response.user,
                    tokens: response.tokens,
                    isLoading: false,
                    error: null,
                });

                message.success(
                    response.message || 'Connexion réussie !'
                );

                return true;
            } else {
                throw new Error(response.message || 'Erreur de connexion');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));

            message.error(errorMessage);
            return false;
        }
    }, []);

    // Fonction d'inscription
    const register = useCallback(async (registerData: RegisterFormData): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.register(registerData);

            if (response.success) {
                setAuthState({
                    isAuthenticated: true,
                    user: response.user,
                    tokens: response.tokens,
                    isLoading: false,
                    error: null,
                });

                message.success(
                    response.message || 'Inscription réussie !'
                );

                return true;
            } else {
                throw new Error(response.message || 'Erreur d\'inscription');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Erreur d\'inscription';

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));

            message.error(errorMessage);
            return false;
        }
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(async () => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            await authService.logout();

            setAuthState(initialAuthState);

            message.info('Déconnexion réussie');

            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Même en cas d'erreur, déconnecter localement
            setAuthState(initialAuthState);
            navigate('/login');
        }
    }, [navigate]);

    // Fonction pour rafraîchir le profil utilisateur
    const refreshProfile = useCallback(async (): Promise<void> => {
        if (!authState.isAuthenticated) return;

        try {
            const response = await authService.getProfile();

            if (response.success) {
                setAuthState(prev => ({
                    ...prev,
                    user: response.user,
                }));
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du profil:', error);
            // En cas d'erreur 401, déconnecter l'utilisateur
            if ((error as any).response?.status === 401) {
                logout();
            }
        }
    }, [authState.isAuthenticated, logout]);

    // Fonction pour vérifier si l'utilisateur a un rôle spécifique
    const hasRole = useCallback((role: string): boolean => {
        // À implémenter selon votre système de rôles
        return true; // Placeholder
    }, []);

    // Fonction pour vider les erreurs
    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    // Fonction pour vérifier si l'utilisateur est connecté
    const checkAuth = useCallback((): boolean => {
        return authService.isAuthenticated() && !!authState.user;
    }, [authState.user]);

    // Fonction pour récupérer le token d'accès
    const getAccessToken = useCallback((): string | null => {
        return authService.getAccessToken();
    }, []);

    return {
        // État
        ...authState,

        // Actions
        login,
        register,
        logout,
        refreshProfile,
        clearError,

        // Utilitaires
        hasRole,
        checkAuth,
        getAccessToken,
    };
};
