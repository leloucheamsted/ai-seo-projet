import React, { useState } from 'react';
import LoadingButton from '../shared/components/LoadingButton';
import { Row, Col, Card, Space, message } from 'antd';
import {
    SaveOutlined,
    DownloadOutlined,
    SendOutlined,
    DeleteOutlined,
    SearchOutlined
} from '@ant-design/icons';

const LoadingButtonExamples: React.FC = () => {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [loading5, setLoading5] = useState(false);

    // Fonction de simulation d'une tâche asynchrone
    const simulateTask = (loadingSetter: React.Dispatch<React.SetStateAction<boolean>>, taskName: string) => {
        loadingSetter(true);
        setTimeout(() => {
            loadingSetter(false);
            message.success(`${taskName} terminée avec succès !`);
        }, 3000); // Simulation de 3 secondes
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-darkText font-ubuntu mb-2">LoadingButton Examples</h1>
                <p className="text-darkText/60">Démonstration des différentes utilisations du composant LoadingButton</p>
            </div>

            <Row gutter={[24, 24]}>
                {/* Exemple 1: Bouton avec texte simple */}
                <Col xs={24} lg={12}>
                    <Card title="Bouton avec texte simple" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Bouton basique qui affiche un spinner avec du texte de chargement
                            </p>
                            <LoadingButton
                                type="primary"
                                isLoading={loading1}
                                loadingText="Sauvegarde..."
                                onClick={() => simulateTask(setLoading1, 'Sauvegarde')}
                                className="bg-primary border-primary hover:bg-primary/80"
                            >
                                Sauvegarder les données
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Exemple 2: Bouton avec icône */}
                <Col xs={24} lg={12}>
                    <Card title="Bouton avec icône" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Bouton avec icône qui est remplacée par un spinner pendant le chargement
                            </p>
                            <LoadingButton
                                type="default"
                                icon={<DownloadOutlined />}
                                isLoading={loading2}
                                loadingText="Téléchargement..."
                                onClick={() => simulateTask(setLoading2, 'Téléchargement')}
                                className="border-primary text-primary hover:bg-primary/5"
                            >
                                Télécharger le rapport
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Exemple 3: Bouton sans texte de chargement (spinner uniquement) */}
                <Col xs={24} lg={12}>
                    <Card title="Spinner uniquement" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Bouton qui affiche uniquement un spinner pendant le chargement
                            </p>
                            <LoadingButton
                                type="primary"
                                isLoading={loading3}
                                onClick={() => simulateTask(setLoading3, 'Envoi')}
                                className="bg-primary border-primary hover:bg-primary/80"
                                spinnerSize="small"
                            >
                                <Space>
                                    <SendOutlined />
                                    Envoyer l'email
                                </Space>
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Exemple 4: Bouton danger avec spinner personnalisé */}
                <Col xs={24} lg={12}>
                    <Card title="Bouton danger avec spinner personnalisé" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Bouton de suppression avec spinner coloré et qui reste actif pendant le chargement
                            </p>
                            <LoadingButton
                                type="primary"
                                danger
                                isLoading={loading4}
                                loadingText="Suppression..."
                                spinnerColor="#ff4d4f"
                                disableWhileLoading={false}
                                onClick={() => simulateTask(setLoading4, 'Suppression')}
                            >
                                <Space>
                                    <DeleteOutlined />
                                    Supprimer définitivement
                                </Space>
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>

                {/* Exemple 5: Bouton large avec contenu complexe */}
                <Col xs={24}>
                    <Card title="Bouton avec contenu complexe" className="h-full">
                        <Space direction="vertical" className="w-full">
                            <p className="text-darkText/60 mb-4">
                                Bouton avec contenu React complexe qui est entièrement remplacé pendant le chargement
                            </p>
                            <LoadingButton
                                type="default"
                                size="large"
                                isLoading={loading5}
                                loadingText="Analyse en cours..."
                                onClick={() => simulateTask(setLoading5, 'Analyse SEO')}
                                className="w-full h-16 border-primary text-primary hover:bg-primary/5"
                                spinnerSize="large"
                            >
                                <div className="flex flex-col items-center space-y-1">
                                    <SearchOutlined className="text-xl" />
                                    <div className="flex flex-col text-center">
                                        <span className="font-medium">Lancer l'analyse SEO</span>
                                        <span className="text-xs opacity-60">Analyse complète du site web</span>
                                    </div>
                                </div>
                            </LoadingButton>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Documentation */}
            <Card title="Props disponibles" className="bg-lightGray/20">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-darkText mb-2">Props principales :</h4>
                        <ul className="space-y-2 text-sm text-darkText/70">
                            <li><code className="bg-primary/10 px-2 py-1 rounded text-primary">isLoading</code> : Boolean - Active l'état de chargement</li>
                            <li><code className="bg-primary/10 px-2 py-1 rounded text-primary">loadingText</code> : String - Texte à afficher avec le spinner (optionnel)</li>
                            <li><code className="bg-primary/10 px-2 py-1 rounded text-primary">spinnerSize</code> : 'small' | 'default' | 'large' - Taille du spinner</li>
                            <li><code className="bg-primary/10 px-2 py-1 rounded text-primary">spinnerColor</code> : String - Couleur du spinner</li>
                            <li><code className="bg-primary/10 px-2 py-1 rounded text-primary">disableWhileLoading</code> : Boolean - Désactive le bouton pendant le chargement (default: true)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-darkText mb-2">Héritage :</h4>
                        <p className="text-sm text-darkText/70">
                            Le composant hérite de toutes les props d'Ant Design Button, sauf <code>loading</code> qui est remplacée par <code>isLoading</code>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoadingButtonExamples;
