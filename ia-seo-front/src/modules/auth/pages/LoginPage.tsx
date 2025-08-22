import React, { useEffect } from 'react';
import { Form, Input, Card, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingButton from '../../../shared/components/LoadingButton';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuth();

    // Sauvegarder la page de redirection si elle est passée dans l'état de navigation
    useEffect(() => {
        const from = location.state?.from?.pathname;
        if (from && from !== '/login') {
            authService.setRedirectPath(from + (location.state?.from?.search || ''));
        }
    }, [location]);

    // Fonction de connexion utilisant le hook useAuth
    const handleLogin = async (values: LoginFormData) => {
        try {
            const success = await login({
                email: values.email,
                password: values.password,
            });

            if (success) {
                // Vérifier s'il y a une page de redirection sauvegardée
                const redirectPath = authService.getAndClearRedirectPath();

                if (redirectPath) {
                    console.log('🔄 Redirection vers:', redirectPath);
                    navigate(redirectPath, { replace: true });
                } else {
                    console.log('🏠 Redirection vers dashboard');
                    navigate('/', { replace: true });
                }
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Row className="w-full max-w-md">
                <Col span={24}>
                    <Card
                        className="shadow-lg border-0"
                        style={{ borderRadius: '12px' }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primaryDark rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserOutlined className="text-white text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-darkText font-ubuntu mb-2">
                                Connexion
                            </h1>
                            <p className="text-darkText/60">
                                Connectez-vous à votre espace SEO
                            </p>
                        </div>

                        {/* Formulaire */}
                        <Form
                            name="login"
                            onFinish={handleLogin}
                            layout="vertical"
                            className="space-y-4"
                        >
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Veuillez saisir votre email' },
                                    { type: 'email', message: 'Format d\'email invalide' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-primary" />}
                                    placeholder="admin@example.com"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mot de passe"
                                rules={[
                                    { required: true, message: 'Veuillez saisir votre mot de passe' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-primary" />}
                                    placeholder="password"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item className="mt-6">
                                <LoadingButton
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="w-full bg-primary border-primary hover:bg-primary/80 rounded-lg h-12"
                                    isLoading={isLoading}
                                    loadingText="Connexion en cours..."
                                >
                                    Se connecter
                                </LoadingButton>
                            </Form.Item>
                        </Form>

                        {/* Footer */}
                        <div className="text-center mt-6 pt-4 border-t border-lightGray">
                            <p className="text-sm text-darkText/60">
                                Pas encore de compte ?{' '}
                                <a
                                    href="/register"
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    S'inscrire
                                </a>
                            </p>
                        </div>

                        {/* Demo credentials */}
                        <div className="mt-4 p-3 bg-lightGray/30 rounded-lg">
                            <p className="text-xs text-darkText/60 text-center mb-2">
                                <strong>Démo :</strong>
                            </p>
                            <p className="text-xs text-darkText/60 text-center">
                                Email: admin@example.com<br />
                                Mot de passe: password
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;
