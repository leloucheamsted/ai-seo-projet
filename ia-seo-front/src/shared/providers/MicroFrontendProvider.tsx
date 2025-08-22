import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { microFrontendConfig, ModuleManager } from '../../config/microfrontend.config';
import { InterModuleCommunication } from '../services/inter-module-communication.service';
import { config } from '../../config/app.config';

interface MicroFrontendContextType {
    enabledModules: Array<{ key: string; module: any }>;
    isModuleLoaded: (moduleName: string) => boolean;
    loadModule: (moduleName: string) => Promise<any>;
    imc: InterModuleCommunication;
    moduleStates: Record<string, 'idle' | 'loading' | 'loaded' | 'error'>;
}

const MicroFrontendContext = createContext<MicroFrontendContextType | undefined>(undefined);

interface MicroFrontendProviderProps {
    children: ReactNode;
}

export function MicroFrontendProvider({ children }: MicroFrontendProviderProps) {
    const [enabledModules, setEnabledModules] = useState<Array<{ key: string; module: any }>>([]);
    const [moduleStates, setModuleStates] = useState<Record<string, 'idle' | 'loading' | 'loaded' | 'error'>>({});
    const [imc] = useState(() => InterModuleCommunication.getInstance());

    useEffect(() => {
        // Initialiser les modules activés
        const modules = ModuleManager.getEnabledModules();
        setEnabledModules(modules);

        // Initialiser les états des modules
        const initialStates: Record<string, 'idle' | 'loading' | 'loaded' | 'error'> = {};
        modules.forEach(({ key }) => {
            initialStates[key] = 'idle';
        });
        setModuleStates(initialStates);

        // Configuration du logging
        if (config.dev.enableDevLogs) {
            console.log('🚀 MicroFrontend Provider initialized');
            console.log('📦 Enabled modules:', modules.map(m => m.key));
        }

        // Précharger les modules critiques si activé
        if (process.env.NODE_APP_PRELOAD_CRITICAL_MODULES === 'true') {
            preloadCriticalModules();
        }
    }, []);

    const preloadCriticalModules = async () => {
        const criticalModules = ['auth']; // Modules critiques à précharger

        for (const moduleName of criticalModules) {
            if (ModuleManager.isModuleEnabled(moduleName as any)) {
                try {
                    await loadModule(moduleName);
                } catch (error) {
                    console.warn(`Failed to preload critical module ${moduleName}:`, error);
                }
            }
        }
    };

    const isModuleLoaded = (moduleName: string): boolean => {
        return moduleStates[moduleName] === 'loaded';
    };

    const loadModule = async (moduleName: string): Promise<any> => {
        if (moduleStates[moduleName] === 'loaded') {
            // Module déjà chargé
            return;
        }

        if (moduleStates[moduleName] === 'loading') {
            // Module en cours de chargement, attendre
            return new Promise((resolve) => {
                const checkLoaded = () => {
                    if (moduleStates[moduleName] === 'loaded') {
                        resolve(true);
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };
                checkLoaded();
            });
        }

        setModuleStates(prev => ({ ...prev, [moduleName]: 'loading' }));

        try {
            await ModuleManager.loadModule(moduleName as any);
            setModuleStates(prev => ({ ...prev, [moduleName]: 'loaded' }));

            // Émettre un événement de module chargé
            imc.emit('module-loaded', { moduleName }, 'system');

            if (config.dev.enableDevLogs) {
                console.log(`✅ Module ${moduleName} loaded successfully`);
            }
        } catch (error) {
            setModuleStates(prev => ({ ...prev, [moduleName]: 'error' }));

            // Émettre un événement d'erreur de module
            imc.emit('module-error', { moduleName, error }, 'system');

            console.error(`❌ Failed to load module ${moduleName}:`, error);
            throw error;
        }
    };

    const contextValue: MicroFrontendContextType = {
        enabledModules,
        isModuleLoaded,
        loadModule,
        imc,
        moduleStates,
    };

    return (
        <MicroFrontendContext.Provider value={contextValue}>
            {children}
        </MicroFrontendContext.Provider>
    );
}

export function useMicroFrontend() {
    const context = useContext(MicroFrontendContext);
    if (context === undefined) {
        throw new Error('useMicroFrontend must be used within a MicroFrontendProvider');
    }
    return context;
}

/**
 * Hook pour vérifier si un module est disponible
 */
export function useModuleAvailability(moduleName: string) {
    const { moduleStates, loadModule } = useMicroFrontend();
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        const checkAvailability = async () => {
            const isEnabled = ModuleManager.isModuleEnabled(moduleName as any);
            const isLoaded = moduleStates[moduleName] === 'loaded';

            setIsAvailable(isEnabled && isLoaded);

            // Charger le module s'il est activé mais pas encore chargé
            if (isEnabled && moduleStates[moduleName] === 'idle') {
                try {
                    await loadModule(moduleName);
                } catch (error) {
                    console.error(`Failed to load module ${moduleName}:`, error);
                }
            }
        };

        checkAvailability();
    }, [moduleName, moduleStates, loadModule]);

    return {
        isAvailable,
        isEnabled: ModuleManager.isModuleEnabled(moduleName as any),
        state: moduleStates[moduleName] || 'idle',
    };
}

export default MicroFrontendProvider;
