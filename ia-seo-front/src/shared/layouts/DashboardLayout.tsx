import React from 'react';

import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_KEYWORD_EXPLORER } from '../constants/routes';

const OVERVIEW_ROUTE = { key: 'overview', label: 'Overview' };

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout className="min-h-screen">
            <Sider breakpoint="lg" collapsedWidth="0" className="bg-primary">
                <div className="logo text-white py-4 px-4 font-bold text-2xl font-ubuntu tracking-wide">
                    SEO Dashboard
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[OVERVIEW_ROUTE.key]}
                    onClick={({ key }) => navigate(key === 'overview' ? '/' : `/${key}`)}
                    items={[OVERVIEW_ROUTE, ...ROUTES]}
                    className="bg-primary"
                />
            </Sider>
            <Layout>
                <Header className="bg-white flex justify-end items-center px-6 h-16 shadow-sm">
                    {/* Ici tu peux ajouter le profil utilisateur, logout, etc. */}
                    <span className="text-darkText font-ubuntu">Bienvenue !</span>
                </Header>
                <Content className="m-6 overflow-auto">
                    <div className="p-6 bg-white min-h-[360px] rounded shadow">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
