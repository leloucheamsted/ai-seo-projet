import React, { Suspense, lazy, ComponentType } from 'react';
import { Spin } from 'antd';
import { ModuleManager } from '../../config/microfrontend.config';

/**
 * Interface pour les modules micro front-end
 */
interface MicroFrontendModuleProps {
    [key: string]: any;
}

/**
 * Higher Order Component pour le lazy loading des modules
 */
export function withMicroFrontendModule<P extends object>(
    moduleName: string,
    importFn: () => Promise<{ default: ComponentType<P> }>
) {
    const LazyComponent = lazy(importFn);

    return function MicroFrontendWrapper(props: P) {
        return (
            <Suspense
                fallback={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px'
                    }}>
                        <Spin size="large" tip={`Chargement du module ${moduleName}...`} />
                    </div>
                }
            >
                <LazyComponent {...props} />
            </Suspense>
        );
    };
}

/**
 * Registry des modules pour le chargement dynamique
 */
export class MicroFrontendRegistry {
    private static modules: Map<string, () => Promise<any>> = new Map();
    private static loadedModules: Map<string, any> = new Map();

    /**
     * Enregistre un module dans le registry
     */
    static registerModule(name: string, importFn: () => Promise<any>): void {
        this.modules.set(name, importFn);
    }

    /**
     * Charge un module de manière asynchrone
     */
    static async loadModule(name: string): Promise<any> {
        // Vérifier si le module est déjà chargé
        if (this.loadedModules.has(name)) {
            return this.loadedModules.get(name);
        }

        // Vérifier si le module est enregistré
        const importFn = this.modules.get(name);
        if (!importFn) {
            throw new Error(`Module ${name} not found in registry`);
        }

        try {
            // Charger le module
            const module = await importFn();
            this.loadedModules.set(name, module);

            console.log(`✅ Module ${name} loaded and cached`);
            return module;
        } catch (error) {
            console.error(`❌ Failed to load module ${name}:`, error);
            throw error;
        }
    }

    /**
     * Récupère tous les modules enregistrés
     */
    static getRegisteredModules(): string[] {
        return Array.from(this.modules.keys());
    }

    /**
     * Vérifie si un module est chargé
     */
    static isModuleLoaded(name: string): boolean {
        return this.loadedModules.has(name);
    }

    /**
     * Décharge un module (utile pour le hot reload)
     */
    static unloadModule(name: string): void {
        this.loadedModules.delete(name);
    }
}

/**
 * Hook pour utiliser les modules micro front-end
 */
export function useMicroFrontendModule(moduleName: string) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [module, setModule] = React.useState<any>(null);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        const loadModule = async () => {
            if (!ModuleManager.isModuleEnabled(moduleName as any)) {
                setError(new Error(`Module ${moduleName} is not enabled`));
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const loadedModule = await MicroFrontendRegistry.loadModule(moduleName);
                setModule(loadedModule);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        loadModule();
    }, [moduleName]);

    return { module, isLoading, error };
}

// Enregistrement des modules
MicroFrontendRegistry.registerModule('auth', () => import('../../modules/auth'));
MicroFrontendRegistry.registerModule('keyword-explorer', () => import('../../modules/keyword-explorer'));
MicroFrontendRegistry.registerModule('url-analyzer', () => import('../../modules/url-analyzer'));
MicroFrontendRegistry.registerModule('rank-monitor', () => import('../../modules/rank-monitor'));

export default MicroFrontendRegistry;
