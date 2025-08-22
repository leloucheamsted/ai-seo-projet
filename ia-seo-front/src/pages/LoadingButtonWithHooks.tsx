import React from 'react';
import LoadingButton from '../shared/components/LoadingButton';
import { useLoadingState, useMultipleLoadingStates } from '../shared/hooks/useLoadingState';
import { Row, Col, Card, Space, message } from 'antd';
import { SaveOutlined, DownloadOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';

const LoadingButtonWithHooks: React.FC = () => {
    // Hook simple pour un seul bouton
    const saveButton = useLoadingState();

    // Hook pour plusieurs boutons avec des clés typées
    const multipleButtons = useMultipleLoadingStates(['download', 'send', 'upload'] as const);

    // Simulation d'une API call
    const mockApiCall = (delay: number = 2000) => {
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve('Succès !');
            }, delay);
        });
    };

    // Gestion avec executeWithLoading (automatique)
    const handleSaveWithAutoLoading = async () => {
        try {
            const result = await saveButton.executeWithLoading(() => mockApiCall(3000));
            message.success(`Sauvegarde: ${result}`);
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    // Gestion manuelle du loading
    const handleDownload = async () => {
        multipleButtons.download.startLoading();
        try {
            await mockApiCall(2000);
            message.success('Téléchargement terminé !');
        } catch (error) {
            message.error('Erreur de téléchargement');
        } finally {
            multipleButtons.download.stopLoading();
        }
    };

    // Avec executeWithLoading sur hook multiple
    const handleSend = async () => {
        try {
            await multipleButtons.send.executeWithLoading(() => mockApiCall(1500));
            message.success('Email envoyé !');
        } catch (error) {
            message.error('Erreur d\'envoi');
        }
    };

    const handleUpload = async () => {
        try {
            await multipleButtons.upload.executeWithLoading(() => mockApiCall(4000));
            message.success('Upload terminé !');
        } catch (error) {
            message.error('Erreur d\'upload');
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-darkText font-ubuntu mb-2">LoadingButton avec Hooks</h1>
                <p className="text-darkText/60">Utilisation simplifiée avec les hooks personnalisés</p>
            </div>

            <Row gutter={[24, 24]}>
                {/* Exemple avec hook simple et executeWithLoading */}
                <Col xs={24} lg={12}>
                    <Card title="Hook simple avec executeWithLoading" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Gestion automatique du loading avec <code>executeWithLoading</code>
                            </p>
                            <LoadingButton
                                type="primary"
                                icon={<SaveOutlined />}
                                isLoading={saveButton.isLoading}
                                loadingText="Sauvegarde en cours..."
                                onClick={handleSaveWithAutoLoading}
                                className="bg-primary border-primary hover:bg-primary/80"
                            >
                                Sauvegarder (Auto Loading)
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Exemple avec gestion manuelle */}
                <Col xs={24} lg={12}>
                    <Card title="Gestion manuelle du loading" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Contrôle manuel avec <code>startLoading()</code> et <code>stopLoading()</code>
                            </p>
                            <LoadingButton
                                type="default"
                                icon={<DownloadOutlined />}
                                isLoading={multipleButtons.download.isLoading}
                                loadingText="Téléchargement..."
                                onClick={handleDownload}
                                className="border-primary text-primary hover:bg-primary/5"
                            >
                                Télécharger (Manuel)
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Plusieurs boutons avec states séparés */}
                <Col xs={24}>
                    <Card title="Plusieurs boutons avec states indépendants" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Utilisation du hook <code>useMultipleLoadingStates</code> pour gérer plusieurs boutons
                            </p>
                            <Space wrap>
                                <LoadingButton
                                    type="primary"
                                    icon={<SendOutlined />}
                                    isLoading={multipleButtons.send.isLoading}
                                    loadingText="Envoi..."
                                    onClick={handleSend}
                                    className="bg-primary border-primary hover:bg-primary/80"
                                >
                                    Envoyer Email
                                </LoadingButton>

                                <LoadingButton
                                    type="default"
                                    icon={<UploadOutlined />}
                                    isLoading={multipleButtons.upload.isLoading}
                                    loadingText="Upload..."
                                    onClick={handleUpload}
                                    className="border-primary text-primary hover:bg-primary/5"
                                >
                                    Upload Fichier
                                </LoadingButton>
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Code examples */}
            <Card title="Exemples de code" className="bg-lightGray/20">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-darkText mb-2">Hook simple :</h4>
                        <pre className="bg-darkText/5 p-4 rounded-lg text-sm overflow-x-auto">
                            {`const saveButton = useLoadingState();

// Gestion automatique
const handleSave = async () => {
  try {
    await saveButton.executeWithLoading(() => apiCall());
    message.success('Succès !');
  } catch (error) {
    message.error('Erreur !');
  }
};

<LoadingButton 
  isLoading={saveButton.isLoading}
  onClick={handleSave}
>
  Sauvegarder
</LoadingButton>`}
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-semibold text-darkText mb-2">Hook multiple :</h4>
                        <pre className="bg-darkText/5 p-4 rounded-lg text-sm overflow-x-auto">
                            {`const buttons = useMultipleLoadingStates(['save', 'delete', 'update'] as const);

// Chaque bouton a son état indépendant
<LoadingButton isLoading={buttons.save.isLoading} onClick={() => {...}}>
  Sauvegarder
</LoadingButton>
<LoadingButton isLoading={buttons.delete.isLoading} onClick={() => {...}}>
  Supprimer  
</LoadingButton>`}
                        </pre>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoadingButtonWithHooks;
