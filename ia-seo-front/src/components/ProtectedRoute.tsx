import React from 'react';
import { AuthGuard } from '../modules/auth/components/AuthGuard';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: string;
    requireAuth?: boolean;
}

/**
 * Wrapper pour les routes protégées
 * Utilise AuthGuard pour vérifier l'authentification
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback = '/login',
    requireAuth = true
}) => {
    // Si l'authentification n'est pas requise, afficher directement le contenu
    if (!requireAuth) {
        return <>{children}</>;
    }

    // Utiliser AuthGuard pour protéger la route
    return (
        <AuthGuard fallback={fallback}>
            {children}
        </AuthGuard>
    );
};

/**
 * HOC pour protéger les composants
 */
export const withAuthGuard = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: { fallback?: string; requireAuth?: boolean }
) => {
    const AuthProtectedComponent = (props: P) => (
        <ProtectedRoute
            fallback={options?.fallback || '/login'}
            requireAuth={options?.requireAuth !== false}
        >
            <WrappedComponent {...props} />
        </ProtectedRoute>
    );

    AuthProtectedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

    return AuthProtectedComponent;
};

export default ProtectedRoute;
