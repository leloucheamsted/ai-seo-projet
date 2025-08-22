import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

interface UseLogoutProps {
    onLogoutSuccess?: () => void;
    redirectTo?: string;
}

interface LogoutState {
    isModalVisible: boolean;
    showModal: () => void;
    hideModal: () => void;
    handleLogout: () => Promise<void>;
}

/**
 * Hook pour gérer la déconnexion avec modal de confirmation
 */
export const useLogout = ({
    onLogoutSuccess,
    redirectTo = '/login'
}: UseLogoutProps = {}): LogoutState => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const showModal = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            // Simulation d'une API de déconnexion
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Nettoyer le localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Nettoyer le sessionStorage si nécessaire
            sessionStorage.clear();

            // Fermer la modal
            setIsModalVisible(false);

            // Message de confirmation
            message.success('Vous avez été déconnecté avec succès');

            // Callback personnalisé si fourni
            if (onLogoutSuccess) {
                onLogoutSuccess();
            }

            // Redirection après un court délai pour laisser voir le message
            setTimeout(() => {
                navigate(redirectTo, { replace: true });
            }, 500);

        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            message.error('Erreur lors de la déconnexion');
        }
    }, [navigate, redirectTo, onLogoutSuccess]);

    return {
        isModalVisible,
        showModal,
        hideModal,
        handleLogout
    };
};
