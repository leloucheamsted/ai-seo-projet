import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: { firstName: string; lastName: string; email: string; password: string; passwordConfirmation: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        tokens: null,
        isLoading: false,
        error: null,
    });

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

    const login = async (email: string, password: string): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.login({ email, password });

            if (response.success) {
                setAuthState({
                    isAuthenticated: true,
                    user: response.user,
                    tokens: response.tokens,
                    isLoading: false,
                    error: null,
                });
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
            return false;
        }
    };

    const register = async (data: { firstName: string; lastName: string; email: string; password: string; passwordConfirmation: string }): Promise<boolean> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.register(data);

            if (response.success) {
                setAuthState({
                    isAuthenticated: true,
                    user: response.user,
                    tokens: response.tokens,
                    isLoading: false,
                    error: null,
                });
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
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            await authService.logout();
            setAuthState({
                isAuthenticated: false,
                user: null,
                tokens: null,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Même en cas d'erreur, déconnecter localement
            setAuthState({
                isAuthenticated: false,
                user: null,
                tokens: null,
                isLoading: false,
                error: null,
            });
        }
    };

    const refreshProfile = async (): Promise<void> => {
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
                await logout();
            }
        }
    };

    const clearError = (): void => {
        setAuthState(prev => ({ ...prev, error: null }));
    };

    const contextValue: AuthContextType = {
        ...authState,
        login,
        register,
        logout,
        refreshProfile,
        clearError,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
