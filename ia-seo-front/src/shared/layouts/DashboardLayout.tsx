import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChartOutlined,
    SearchOutlined,
    LinkOutlined,
    RiseOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
    PlusOutlined,
    BellOutlined
} from '@ant-design/icons';
import { ROUTES } from '../constants/routes';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import { useLogout } from '../hooks/useLogout';

const { Header, Sider, Content } = Layout;

// Icônes dorées pour les stats
const StatsIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primaryDark/20 to-primaryDark/30 text-primaryDark">
        {children}
    </div>
);

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Hook pour gérer la déconnexion
    const logout = useLogout({
        onLogoutSuccess: () => {
            console.log('Déconnexion réussie');
        }
    });

    // Récupération des données utilisateur
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = userData?.firstName && userData?.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : userData?.name || 'Admin';
    const userEmail = userData?.email || 'admin@example.com';

    const menuItems = [
        {
            key: '/',
            icon: <div className="w-2 h-2 rounded-full bg-primary"></div>,
            label: 'Overview',
            className: 'font-medium'
        },
        {
            key: '/keyword-explorer',
            icon: <div className="w-2 h-2 rounded-full bg-lightGray"></div>,
            label: 'Keyword Explorer',
            className: 'font-medium text-darkText/60'
        },
        {
            key: '/url-analyzer',
            icon: <div className="w-2 h-2 rounded-full bg-lightGray"></div>,
            label: 'URL Analyzer',
            className: 'font-medium text-darkText/60'
        },
        {
            key: '/rank-monitor',
            icon: <div className="w-2 h-2 rounded-full bg-lightGray"></div>,
            label: 'Rank Monitor',
            className: 'font-medium text-darkText/60'
        },
        // Exemples de développement
        {
            key: '/loading-examples',
            icon: <div className="w-2 h-2 rounded-full bg-primaryDark"></div>,
            label: 'Loading Examples',
            className: 'font-medium text-primaryDark'
        },
        {
            key: '/loading-hooks',
            icon: <div className="w-2 h-2 rounded-full bg-primaryDark"></div>,
            label: 'Loading Hooks',
            className: 'font-medium text-primaryDark'
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profil',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Paramètres',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Déconnexion',
            danger: true,
        },
    ];

    // Gestionnaire pour le menu utilisateur
    const handleUserMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                // Navigation vers le profil
                console.log('Navigation vers profil');
                break;
            case 'settings':
                // Navigation vers les paramètres
                console.log('Navigation vers paramètres');
                break;
            case 'logout':
                logout.showModal();
                break;
            default:
                break;
        }
    };

    return (
        <Layout className="h-screen overflow-hidden bg-background">
            {/* Fixed Sidebar */}
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                collapsed={collapsed}
                onCollapse={setCollapsed}
                className="bg-white border-lightGray fixed h-full z-10"
                width={240}
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.02)',
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="px-6 py-8">
                        <h1 className="text-2xl font-bold text-primary tracking-tight font-ubuntu">
                            IA SEO Tool
                        </h1>
                    </div>

                    {/* Menu */}
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        className="flex-1 border-none bg-transparent"
                        onClick={({ key }) => navigate(key)}
                        items={menuItems}
                        style={{
                            borderRight: 'none',
                        }}
                    />

                    {/* Add new section */}
                    <div className="px-6 py-4 border-t border-lightGray">
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            className="w-full text-left justify-start text-primary hover:bg-primary/10"
                        >
                            Add new analysis
                        </Button>
                    </div>

                    {/* Welcome section */}
                    <div className="p-6 bg-gradient-to-br from-primary to-lightgray m-4 rounded-lg">
                        <div className="flex flex-col items-center justify-center space-x-1 mb-2">
                            <Avatar size={30} icon={<UserOutlined />} className="bg-lightgray text-white" />
                            <div className='text-center'>
                                <h3 className="font-semibold text-darkText font-ubuntu">Welcome Admin!</h3>
                                <p className="text-xs text-darkText/60">Manage your SEO tools efficiently</p>
                            </div>
                        </div>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            className="text-darkText/60 text-center w-full flex justify-center hover:text-darkText text-xs p-2 h-auto"
                            onClick={logout.showModal}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 0 : 240 }} className="h-screen">
                {/* Fixed Header */}
                <Header
                    className="bg-white border-lightGray px-8 h-20 flex items-center justify-between shadow-sm fixed w-full z-[9]"
                    style={{
                        left: collapsed ? 0 : 240,
                        width: collapsed ? '100%' : 'calc(100% - 240px)',
                    }}
                >
                    {/* Logo mobile */}
                    <div className="lg:hidden">
                        <h1 className="text-xl font-bold text-primary font-ubuntu">IA SEO Tool</h1>
                    </div>

                    {/* Stats */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {/* <div className="flex items-center space-x-3">
                            <StatsIcon>
                                <SearchOutlined className="text-sm" />
                            </StatsIcon>
                            <div>
                                <div className="text-2xl font-bold text-darkText font-ubuntu">1,247</div>
                                <div className="text-sm text-darkText/60">Keywords analyzed</div>
                            </div>
                        </div> */}

                        <div className="flex items-center space-x-3">
                            <StatsIcon>
                                <RiseOutlined className="text-sm" />
                            </StatsIcon>
                            <div>
                                <div className="text-2xl font-bold text-darkText font-ubuntu">$892</div>
                                <div className="text-sm text-darkText/60">Total cost saved</div>
                            </div>
                        </div>

                        {/* <div className="flex items-center space-x-3">
                            <StatsIcon>
                                <BarChartOutlined className="text-sm" />
                            </StatsIcon>
                            <div>
                                <div className="text-2xl font-bold text-darkText font-ubuntu">12</div>
                                <div className="text-sm text-darkText/60">Active projects</div>
                            </div>
                        </div> */}
                    </div>

                    {/* User section */}
                    <div className="flex items-center space-x-4">
                        <Badge count={3} size="small">
                            <Button
                                type="text"
                                icon={<BellOutlined />}
                                className="text-darkText/60 hover:text-darkText"
                            />
                        </Badge>

                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: handleUserMenuClick
                            }}
                            placement="bottomRight"
                        >
                            <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-background">
                                <Avatar
                                    className="bg-primary text-white"
                                    size="default"
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </Avatar>
                                <div className="hidden sm:block">
                                    <div className="text-sm font-medium text-darkText font-ubuntu">{userName}</div>
                                    <div className="text-xs text-darkText/60">{userEmail}</div>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                {/* Scrollable Content */}
                <Content
                    className="p-8 overflow-y-auto"
                    style={{
                        marginTop: '80px', // Height of fixed header
                        height: 'calc(100vh - 80px)',
                    }}
                >
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            {/* Modal de confirmation de déconnexion */}
            <LogoutConfirmModal
                isVisible={logout.isModalVisible}
                onConfirm={logout.handleLogout}
                onCancel={logout.hideModal}
                userName={userName}
                userEmail={userEmail}
            />
        </Layout>
    );
};

export default DashboardLayout;
