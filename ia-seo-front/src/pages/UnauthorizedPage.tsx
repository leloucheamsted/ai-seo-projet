import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Button } from 'antd';
import { storage } from '../shared/services/storage';
import { ACCESS_TOKEN_KEY } from '../shared/constants/auth';
import { config } from '../config/app.config';

interface UnauthorizedPageProps {
    redirectTo?: string;
    message?: string;
    showRetryButton?: boolean;
}

/**
 * Page affichée quand l'utilisateur n'est pas autorisé
 */
export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
    redirectTo = '/login',
    message = "Vous devez être connecté pour accéder à cette page",
    showRetryButton = true
}) => {
    const location = useLocation();

    // Nettoyer les tokens invalides au montage
    useEffect(() => {
        const cleanup = () => {
            // Vérifier si les tokens existent mais sont invalides
            const hasNewToken = storage.get<string>(ACCESS_TOKEN_KEY);
            const hasLegacyToken = localStorage.getItem(config.auth.tokenStorageKey) ||
                localStorage.getItem('authToken');

            if (hasNewToken || hasLegacyToken) {
                console.log('🧹 Nettoyage des tokens invalides...');

                // Nettoyer tous les tokens
                storage.remove(ACCESS_TOKEN_KEY);
                storage.remove('refresh_token');
                storage.remove(config.auth.userStorageKey);

                localStorage.removeItem(config.auth.tokenStorageKey);
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        };

        cleanup();
    }, []);

    const handleRetry = () => {
        // Recharger la page pour re-vérifier l'authentification
        window.location.reload();
    };

    const handleLogin = () => {
        // Sauvegarder la page actuelle pour redirection après login
        const currentPath = location.pathname + location.search;
        localStorage.setItem('redirectAfterLogin', currentPath);

        // Rediriger vers login
        window.location.href = redirectTo;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full">
                <Result
                    status="403"
                    title="Accès non autorisé"
                    subTitle={message}
                    extra={[
                        <Button type="primary" key="login" onClick={handleLogin}>
                            Se connecter
                        </Button>,
                        ...(showRetryButton ? [
                            <Button key="retry" onClick={handleRetry}>
                                Réessayer
                            </Button>
                        ] : [])
                    ]}
                />
            </div>
        </div>
    );
};

/**
 * Hook pour rediriger après login
 */
export const useRedirectAfterLogin = () => {
    useEffect(() => {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath && redirectPath !== '/login' && redirectPath !== '/register') {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectPath;
        }
    }, []);
};

export default UnauthorizedPage;
