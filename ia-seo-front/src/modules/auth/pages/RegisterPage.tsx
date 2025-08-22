import React from 'react';
import { Form, Input, Card, Row, Col, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../../../shared/components/LoadingButton';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const [form] = Form.useForm();

    // Simulation d'une API d'inscription
    const handleRegister = async (values: RegisterFormData) => {
        try {
            const { confirmPassword, agreeToTerms, phone, ...userData } = values;

            const success = await register({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                passwordConfirmation: confirmPassword,
            });

            if (success) {
                navigate('/'); // Redirection vers le dashboard
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Row className="w-full max-w-lg">
                <Col span={24}>
                    <Card
                        className="shadow-lg border-0"
                        style={{ borderRadius: '12px' }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primaryDark rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserAddOutlined className="text-white text-2xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-darkText font-ubuntu mb-2">
                                Créer un compte
                            </h1>
                            <p className="text-darkText/60">
                                Rejoignez-nous et commencez votre analyse SEO
                            </p>
                        </div>

                        {/* Formulaire */}
                        <Form
                            form={form}
                            name="register"
                            onFinish={handleRegister}
                            layout="vertical"
                            className="space-y-4"
                            scrollToFirstError
                        >
                            {/* Nom et Prénom */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        label="Prénom"
                                        rules={[
                                            { required: true, message: 'Veuillez saisir votre prénom' },
                                            { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-primary" />}
                                            placeholder="Jean"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        label="Nom"
                                        rules={[
                                            { required: true, message: 'Veuillez saisir votre nom' },
                                            { min: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-primary" />}
                                            placeholder="Dupont"
                                            size="large"
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Email */}
                            <Form.Item
                                name="email"
                                label="Adresse email"
                                rules={[
                                    { required: true, message: 'Veuillez saisir votre email' },
                                    { type: 'email', message: 'Format d\'email invalide' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-primary" />}
                                    placeholder="jean.dupont@example.com"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* Téléphone (optionnel) */}
                            <Form.Item
                                name="phone"
                                label="Téléphone (optionnel)"
                                rules={[
                                    { pattern: /^[+]?[0-9\s\-()]{8,}$/, message: 'Format de téléphone invalide' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-primary" />}
                                    placeholder="+33 1 23 45 67 89"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* Mot de passe */}
                            <Form.Item
                                name="password"
                                label="Mot de passe"
                                rules={[
                                    { required: true, message: 'Veuillez saisir un mot de passe' },
                                    { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-primary" />}
                                    placeholder="Mot de passe sécurisé"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* Confirmation mot de passe */}
                            <Form.Item
                                name="confirmPassword"
                                label="Confirmer le mot de passe"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Veuillez confirmer votre mot de passe' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-primary" />}
                                    placeholder="Confirmer le mot de passe"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            {/* Conditions d'utilisation */}
                            <Form.Item
                                name="agreeToTerms"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value ? Promise.resolve() : Promise.reject(new Error('Vous devez accepter les conditions d\'utilisation'))
                                    }
                                ]}
                            >
                                <Checkbox className="text-sm">
                                    J'accepte les{' '}
                                    <a href="#" className="text-primary hover:text-primary/80">
                                        conditions d'utilisation
                                    </a>{' '}
                                    et la{' '}
                                    <a href="#" className="text-primary hover:text-primary/80">
                                        politique de confidentialité
                                    </a>
                                </Checkbox>
                            </Form.Item>

                            {/* Bouton d'inscription */}
                            <Form.Item className="mt-6">
                                <LoadingButton
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="w-full bg-primary border-primary hover:bg-primary/80 rounded-lg h-12"
                                    isLoading={isLoading}
                                    loadingText="Création du compte..."
                                >
                                    Créer mon compte
                                </LoadingButton>
                            </Form.Item>
                        </Form>

                        {/* Footer */}
                        <div className="text-center mt-6 pt-4 border-t border-lightGray">
                            <p className="text-sm text-darkText/60">
                                Déjà un compte ?{' '}
                                <a
                                    href="/login"
                                    className="text-primary hover:text-primary/80 font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                >
                                    Se connecter
                                </a>
                            </p>
                        </div>

                        {/* Info pour test */}
                        <div className="mt-4 p-3 bg-lightGray/30 rounded-lg">
                            <p className="text-xs text-darkText/60 text-center mb-2">
                                <strong>Note :</strong>
                            </p>
                            <p className="text-xs text-darkText/60 text-center">
                                L'email "existing@example.com" simulera une erreur d'email déjà utilisé
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;
