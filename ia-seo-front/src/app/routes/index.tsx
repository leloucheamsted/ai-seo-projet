import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Spin } from 'antd';
import { LoginPage, RegisterPage } from '../../modules/auth';
import DashboardLayout from '../../shared/layouts/DashboardLayout';
import { ModuleManager } from '../../config/microfrontend.config';

// Lazy loading de la page Dashboard
const DashboardPage = lazy(() => import('../../pages/DashboardPage'));

// Pages d'exemples (pour développement)
const LoadingButtonExamples = lazy(() => import('../../pages/LoadingButtonExamples'));
const LoadingButtonWithHooks = lazy(() => import('../../pages/LoadingButtonWithHooks'));

// Lazy loading des modules avec Suspense
const KeywordExplorerPage = lazy(() =>
    import('../../modules/keyword-explorer/pages/KeywordExplorerPage').then(module => ({
        default: module.KeywordExplorerPage
    }))
);

const UrlAnalyzerPage = lazy(() =>
    import('../../modules/url-analyzer/pages/UrlAnalyzerPage').then(module => ({
        default: module.UrlAnalyzerPage
    }))
);

const RankMonitorPage = lazy(() =>
    import('../../modules/rank-monitor/pages/RankMonitorPage').then(module => ({
        default: module.RankMonitorPage
    }))
);

// Composant de chargement pour les modules
const ModuleLoadingSpinner = ({ moduleName }: { moduleName: string }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
    }}>
        <Spin size="large" tip={`Chargement du module ${moduleName}...`} />
    </div>
);

// Wrapper pour Suspense avec fallback personnalisé
const withSuspense = (Component: React.LazyExoticComponent<any>, moduleName: string) => {
    return (props: any) => (
        <Suspense fallback={<ModuleLoadingSpinner moduleName={moduleName} />}>
            <Component {...props} />
        </Suspense>
    );
};

const routes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            // Route par défaut pour le dashboard
            {
                index: true,
                element: withSuspense(DashboardPage, 'Dashboard')({})
            },
            // Pages d'exemples (développement)
            {
                path: 'loading-examples',
                element: withSuspense(LoadingButtonExamples, 'Loading Examples')({})
            },
            {
                path: 'loading-hooks',
                element: withSuspense(LoadingButtonWithHooks, 'Loading Hooks')({})
            },

            // Routes conditionnelles basées sur les feature flags
            ...(ModuleManager.isModuleEnabled('keywordExplorer')
                ? [{
                    path: 'keyword-explorer',
                    element: withSuspense(KeywordExplorerPage, 'Keyword Explorer')({})
                }]
                : []
            ),
            ...(ModuleManager.isModuleEnabled('urlAnalyzer')
                ? [{
                    path: 'url-analyzer',
                    element: withSuspense(UrlAnalyzerPage, 'URL Analyzer')({})
                }]
                : []
            ),
            ...(ModuleManager.isModuleEnabled('rankMonitor')
                ? [{
                    path: 'rank-monitor',
                    element: withSuspense(RankMonitorPage, 'Rank Monitor')({})
                }]
                : []
            ),
        ],
    },
];

export default routes;
