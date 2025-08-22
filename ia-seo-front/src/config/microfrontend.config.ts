/**
 * Configuration spécifique à l'architecture micro front-end
 * Permet la gestion modulaire et le lazy loading des modules
 */

import { config } from './app.config';

export interface MicroFrontendModule {
    name: string;
    enabled: boolean;
    route: string;
    bundlePath?: string;
    version: string;
    dependencies: string[];
    lazy: boolean;
}

export interface MicroFrontendConfig {
    modules: {
        auth: MicroFrontendModule;
        keywordExplorer: MicroFrontendModule;
        urlAnalyzer: MicroFrontendModule;
        rankMonitor: MicroFrontendModule;
        dashboard: MicroFrontendModule;
    };
    registry: {
        enabled: boolean;
        url?: string;
    };
    sharedDependencies: string[];
    moduleLoadingTimeout: number;
}

/**
 * Configuration des modules micro front-end
 */
export const microFrontendConfig: MicroFrontendConfig = {
    modules: {
        auth: {
            name: 'Auth Module',
            enabled: true,
            route: '/auth',
            version: '1.0.0',
            dependencies: ['react', 'react-dom', 'antd'],
            lazy: false, // Module critique, pas de lazy loading
        },
        keywordExplorer: {
            name: 'Keyword Explorer Module',
            enabled: config.features.keywordExplorer,
            route: '/keyword-explorer',
            version: '1.0.0',
            dependencies: ['react', 'react-dom', 'antd', 'axios'],
            lazy: true,
        },
        urlAnalyzer: {
            name: 'URL Analyzer Module',
            enabled: config.features.urlAnalyzer,
            route: '/url-analyzer',
            version: '1.0.0',
            dependencies: ['react', 'react-dom', 'antd', 'axios'],
            lazy: true,
        },
        rankMonitor: {
            name: 'Rank Monitor Module',
            enabled: config.features.rankMonitor,
            route: '/rank-monitor',
            version: '1.0.0',
            dependencies: ['react', 'react-dom', 'antd', 'axios'],
            lazy: true,
        },
        dashboard: {
            name: 'Dashboard Module',
            enabled: config.features.dashboardAnalytics,
            route: '/dashboard',
            version: '1.0.0',
            dependencies: ['react', 'react-dom', 'antd', 'axios'],
            lazy: true,
        },
    },
    registry: {
        enabled: process.env.NODE_APP_MODULE_REGISTRY_ENABLED === 'true',
        url: process.env.NODE_APP_MODULE_REGISTRY_URL,
    },
    sharedDependencies: ['react', 'react-dom', 'antd', 'axios', 'react-router-dom'],
    moduleLoadingTimeout: parseInt(process.env.NODE_APP_MODULE_LOADING_TIMEOUT || '10000'),
};

/**
 * Utilitaires pour la gestion des modules
 */
export class ModuleManager {
    /**
     * Vérifie si un module est activé
     */
    static isModuleEnabled(moduleName: keyof MicroFrontendConfig['modules']): boolean {
        return microFrontendConfig.modules[moduleName]?.enabled || false;
    }

    /**
     * Récupère la configuration d'un module
     */
    static getModuleConfig(moduleName: keyof MicroFrontendConfig['modules']): MicroFrontendModule | null {
        return microFrontendConfig.modules[moduleName] || null;
    }

    /**
     * Récupère tous les modules activés
     */
    static getEnabledModules(): Array<{ key: string; module: MicroFrontendModule }> {
        return Object.entries(microFrontendConfig.modules)
            .filter(([_, module]) => module.enabled)
            .map(([key, module]) => ({ key, module }));
    }

    /**
     * Charge dynamiquement un module
     */
    static async loadModule(moduleName: keyof MicroFrontendConfig['modules']): Promise<any> {
        const moduleConfig = this.getModuleConfig(moduleName);

        if (!moduleConfig || !moduleConfig.enabled) {
            throw new Error(`Module ${moduleName} is not enabled or does not exist`);
        }

        try {
            // Simulation du chargement dynamique
            // Dans une vraie implémentation, ceci chargerait le module depuis un CDN ou un bundle séparé
            const module = await import(`../modules/${moduleName}`);

            if (config.dev.enableDevLogs) {
                console.log(`✅ Module ${moduleName} loaded successfully`);
            }

            return module;
        } catch (error) {
            console.error(`❌ Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }

    /**
     * Valide les dépendances d'un module
     */
    static validateModuleDependencies(moduleName: keyof MicroFrontendConfig['modules']): boolean {
        const moduleConfig = this.getModuleConfig(moduleName);

        if (!moduleConfig) return false;

        // Vérification basique des dépendances
        const missingDeps = moduleConfig.dependencies.filter(dep => {
            try {
                require.resolve(dep);
                return false;
            } catch {
                return true;
            }
        });

        if (missingDeps.length > 0) {
            console.warn(`⚠️  Module ${moduleName} has missing dependencies:`, missingDeps);
            return false;
        }

        return true;
    }
}

export default microFrontendConfig;
