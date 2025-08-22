import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../../../shared/services/storage';
import { ACCESS_TOKEN_KEY } from '../../../shared/constants/auth';
import { config } from '../../../config/app.config';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: string;
}

/**
 * Vérifie si un token d'authentification existe
 */
const hasValidToken = (): boolean => {
    // Vérifier d'abord avec les nouvelles constantes
    const newToken = storage.get<string>(ACCESS_TOKEN_KEY);
    if (newToken) return true;

    // Fallback pour les anciennes clés
    const legacyToken = localStorage.getItem(config.auth.tokenStorageKey) ||
        localStorage.getItem('authToken');
    return !!legacyToken;
};

/**
 * Composant de garde d'authentification
 * Bloque l'accès si aucun token n'existe et redirige vers login
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback = '/login' }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Vérification immédiate du token
    const hasToken = hasValidToken();

    // Si pas de token, redirection immédiate sans attendre useAuth
    if (!hasToken) {
        console.log('🚫 AuthGuard: Aucun token trouvé, redirection vers', fallback);
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    // Afficher un spinner pendant le chargement de l'état d'authentification
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-4 text-gray-600">Vérification de l'authentification...</div>
                </div>
            </div>
        );
    }

    // Double vérification avec useAuth pour s'assurer que l'utilisateur est bien authentifié
    if (!isAuthenticated) {
        console.log('🚫 AuthGuard: Utilisateur non authentifié, redirection vers', fallback);
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    // Si token présent ET utilisateur authentifié, afficher le contenu
    console.log('✅ AuthGuard: Accès autorisé pour', location.pathname);
    return <>{children}</>;
};

/**
 * Composant de garde pour les routes publiques (login, register)
 * Redirige vers le dashboard si l'utilisateur est déjà connecté
 */
export const PublicRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({
    children,
    redirectTo = '/'
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Vérification immédiate du token
    const hasToken = hasValidToken();

    // Si token présent, on considère l'utilisateur comme potentiellement authentifié
    // Attendre la confirmation de useAuth
    if (hasToken && isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-4 text-gray-600">Vérification de l'authentification...</div>
                </div>
            </div>
        );
    }

    // Si token présent ET utilisateur authentifié, rediriger vers le dashboard
    if (hasToken && isAuthenticated) {
        console.log('🔄 PublicRoute: Utilisateur déjà connecté, redirection vers', redirectTo);
        return <Navigate to={redirectTo} replace />;
    }

    // Si pas de token OU non authentifié, afficher la page publique
    console.log('✅ PublicRoute: Accès autorisé à la page publique');
    return <>{children}</>;
};

/**
 * Hook pour vérifier rapidement l'état du token
 */
export const useTokenCheck = () => {
    return {
        hasToken: hasValidToken(),
        checkToken: hasValidToken
    };
};
