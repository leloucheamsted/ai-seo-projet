import React from 'react';
import { Modal, Button, Space, Avatar } from 'antd';
import { LogoutOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import LoadingButton from './LoadingButton';
import { useLoadingState } from '../hooks/useLoadingState';
import './LogoutModal.css';

interface LogoutConfirmModalProps {
    isVisible: boolean;
    onConfirm: () => Promise<void> | void;
    onCancel: () => void;
    userName?: string;
    userEmail?: string;
    userAvatar?: string;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
    isVisible,
    onConfirm,
    onCancel,
    userName = 'Utilisateur',
    userEmail,
    userAvatar
}) => {
    const logoutButton = useLoadingState();

    const handleConfirm = async () => {
        try {
            await logoutButton.executeWithLoading(async () => {
                if (onConfirm) {
                    await onConfirm();
                }
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <Modal
            open={isVisible}
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
            className="logout-modal"
            styles={{
                mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            }}
            closeIcon={false}
        >
            <div className="p-6">
                {/* Header avec icône d'alerte */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExclamationCircleOutlined className="text-orange-500 text-2xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-darkText font-ubuntu mb-2">
                        Confirmer la déconnexion
                    </h2>
                    <p className="text-darkText/60 text-sm">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                </div>

                {/* Informations utilisateur */}
                <div className="bg-lightGray/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <Avatar
                            size={40}
                            src={userAvatar}
                            icon={!userAvatar ? <UserOutlined /> : undefined}
                            className="bg-primary text-white"
                        >
                            {!userAvatar && userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-darkText truncate">
                                {userName}
                            </p>
                            {userEmail && (
                                <p className="text-sm text-darkText/60 truncate">
                                    {userEmail}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations de session */}
                <div className="bg-blue-50/80 rounded-lg p-3 mb-6">
                    <div className="flex items-start space-x-2">
                        <ExclamationCircleOutlined className="text-blue-500 text-sm mt-0.5" />
                        <div className="text-xs text-blue-700">
                            <p className="font-medium mb-1">Que se passe-t-il quand vous vous déconnectez ?</p>
                            <ul className="list-disc list-inside space-y-0.5 text-blue-600">
                                <li>Votre session sera fermée</li>
                                <li>Les données non sauvegardées seront perdues</li>
                                <li>Vous serez redirigé vers la page de connexion</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={onCancel}
                        size="large"
                        className="px-6 border-lightGray text-darkText hover:border-primary hover:text-primary"
                        disabled={logoutButton.isLoading}
                    >
                        Annuler
                    </Button>
                    <LoadingButton
                        type="primary"
                        danger
                        size="large"
                        icon={<LogoutOutlined />}
                        onClick={handleConfirm}
                        isLoading={logoutButton.isLoading}
                        loadingText="Déconnexion..."
                        className="px-6 bg-red-500 border-red-500 hover:bg-red-600"
                    >
                        Se déconnecter
                    </LoadingButton>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutConfirmModal;
