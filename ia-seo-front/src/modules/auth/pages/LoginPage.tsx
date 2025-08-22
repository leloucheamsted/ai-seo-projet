import React from 'react';
import { Form, Input, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../../../shared/components/LoadingButton';
import { useLoadingState } from '../../../shared/hooks/useLoadingState';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const loginButton = useLoadingState();

    // Simulation d'une API de connexion
    const mockLogin = (email: string, password: string): Promise<{ token: string; user: any }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@example.com' && password === 'password') {
                    resolve({
                        token: 'mock-jwt-token',
                        user: { id: 1, email, name: 'Admin User' }
                    });
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 2000); // Simulation de 2 secondes de latence
        });
    };

    const handleLogin = async (values: LoginFormData) => {
        try {
            const { token, user } = await loginButton.executeWithLoading(() =>
                mockLogin(values.email, values.password)
            );

            // Stocker le token et les données utilisateur
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            message.success('Connexion réussie !');
            navigate('/'); // Redirection vers le dashboard
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Erreur de connexion');
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
                                    isLoading={loginButton.isLoading}
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
