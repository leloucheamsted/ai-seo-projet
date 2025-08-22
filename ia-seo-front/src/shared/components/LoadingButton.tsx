import React from 'react';
import { Button, Spin } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
    /**
     * État de chargement - remplace le contenu par un spinner
     */
    isLoading?: boolean;
    /**
     * Contenu à afficher quand le bouton n'est pas en cours de chargement
     * Peut être du texte ou un composant React
     */
    children: React.ReactNode;
    /**
     * Texte à afficher pendant le chargement (optionnel)
     * Si non fourni, seul le spinner sera affiché
     */
    loadingText?: string;
    /**
     * Taille du spinner de chargement
     */
    spinnerSize?: 'small' | 'default' | 'large';
    /**
     * Couleur personnalisée du spinner
     */
    spinnerColor?: string;
    /**
     * Désactiver le bouton pendant le chargement
     */
    disableWhileLoading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading = false,
    children,
    loadingText,
    spinnerSize = 'default',
    spinnerColor,
    disableWhileLoading = true,
    className = '',
    ...buttonProps
}) => {
    // Icône de chargement personnalisée
    const loadingIcon = (
        <LoadingOutlined
            style={{
                fontSize: spinnerSize === 'small' ? '12px' : spinnerSize === 'large' ? '18px' : '14px',
                color: spinnerColor
            }}
            spin
        />
    );

    // Contenu du bouton pendant le chargement
    const loadingContent = loadingText ? (
        <span className="flex items-center space-x-2">
            <Spin
                indicator={loadingIcon}
                size={spinnerSize}
            />
            <span>{loadingText}</span>
        </span>
    ) : (
        <Spin
            indicator={loadingIcon}
            size={spinnerSize}
        />
    );

    return (
        <Button
            {...buttonProps}
            disabled={isLoading && disableWhileLoading ? true : buttonProps.disabled}
            className={`${className} ${isLoading ? 'cursor-wait' : ''}`}
        >
            {isLoading ? loadingContent : children}
        </Button>
    );
};

export default LoadingButton;
