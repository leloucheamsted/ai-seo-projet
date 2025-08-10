import React from 'react';
import { RouteObject } from 'react-router-dom';
import { LoginPage, RegisterPage } from '../../modules/auth';
import DashboardLayout from '../../shared/layouts/DashboardLayout';
import { KeywordExplorerPage } from '../../modules/keyword-explorer/pages/KeywordExplorerPage';
import { UrlAnalyzerPage } from '../../modules/url-analyzer/pages/UrlAnalyzerPage';
import { RankMonitorPage } from '../../modules/rank-monitor/pages/RankMonitorPage';

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
            { path: 'keyword-explorer', element: <KeywordExplorerPage /> },
            { path: 'url-analyzer', element: <UrlAnalyzerPage /> },
            { path: 'rank-monitor', element: <RankMonitorPage /> },
        ],
    },
];

export default routes;
