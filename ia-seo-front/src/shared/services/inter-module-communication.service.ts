/**
 * Service de communication entre les modules micro front-end
 * Permet l'échange de données et d'événements entre modules
 */

import React from 'react';

interface ModuleEvent {
    type: string;
    payload: any;
    source: string;
    target?: string;
    timestamp: Date;
}

interface EventListener {
    callback: (event: ModuleEvent) => void;
    once?: boolean;
}

export class InterModuleCommunication {
    private static instance: InterModuleCommunication;
    private eventListeners: Map<string, EventListener[]> = new Map();
    private messageQueue: ModuleEvent[] = [];
    private isEnabled: boolean = true;

    private constructor() {
        // Singleton
    }

    static getInstance(): InterModuleCommunication {
        if (!InterModuleCommunication.instance) {
            InterModuleCommunication.instance = new InterModuleCommunication();
        }
        return InterModuleCommunication.instance;
    }

    /**
     * Émet un événement vers d'autres modules
     */
    emit(type: string, payload: any, source: string, target?: string): void {
        if (!this.isEnabled) return;

        const event: ModuleEvent = {
            type,
            payload,
            source,
            target,
            timestamp: new Date(),
        };

        // Ajouter à la queue
        this.messageQueue.push(event);

        // Traiter immédiatement
        this.processEvent(event);

        console.log(`📡 Event emitted: ${type} from ${source}`, payload);
    }

    /**
     * Écoute un type d'événement
     */
    on(eventType: string, callback: (event: ModuleEvent) => void, once = false): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }

        this.eventListeners.get(eventType)!.push({ callback, once });
    }

    /**
     * Écoute un événement une seule fois
     */
    once(eventType: string, callback: (event: ModuleEvent) => void): void {
        this.on(eventType, callback, true);
    }

    /**
     * Arrête d'écouter un événement
     */
    off(eventType: string, callback?: (event: ModuleEvent) => void): void {
        if (!this.eventListeners.has(eventType)) return;

        if (!callback) {
            // Supprimer tous les listeners pour ce type
            this.eventListeners.delete(eventType);
        } else {
            // Supprimer le listener spécifique
            const listeners = this.eventListeners.get(eventType)!;
            const index = listeners.findIndex(listener => listener.callback === callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Traite un événement
     */
    private processEvent(event: ModuleEvent): void {
        const listeners = this.eventListeners.get(event.type);
        if (!listeners) return;

        listeners.forEach((listener, index) => {
            try {
                listener.callback(event);

                // Supprimer les listeners "once"
                if (listener.once) {
                    listeners.splice(index, 1);
                }
            } catch (error) {
                console.error(`Error processing event ${event.type}:`, error);
            }
        });
    }

    /**
     * Récupère l'historique des messages
     */
    getMessageHistory(limit?: number): ModuleEvent[] {
        return limit ? this.messageQueue.slice(-limit) : this.messageQueue;
    }

    /**
     * Vide la queue des messages
     */
    clearMessageQueue(): void {
        this.messageQueue = [];
    }

    /**
     * Active/désactive la communication
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    /**
     * Méthodes utilitaires pour des événements spécifiques
     */

    // Navigation entre modules
    navigateToModule(moduleName: string, route: string, params?: any): void {
        this.emit('navigate', { moduleName, route, params }, 'system');
    }

    // Partage de données utilisateur
    shareUserData(userData: any, source: string): void {
        this.emit('user-data-updated', userData, source);
    }

    // Notifications globales
    showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning', source: string): void {
        this.emit('notification', { message, type }, source);
    }

    // Synchronisation de l'état d'authentification
    updateAuthState(isAuthenticated: boolean, user: any, source: string): void {
        this.emit('auth-state-changed', { isAuthenticated, user }, source);
    }

    // Mise à jour des données partagées
    updateSharedData(key: string, data: any, source: string): void {
        this.emit('shared-data-updated', { key, data }, source);
    }
}

/**
 * Hook React pour utiliser la communication inter-module
 */
export function useInterModuleCommunication(moduleName: string) {
    const imc = InterModuleCommunication.getInstance();

    const emit = React.useCallback(
        (type: string, payload: any, target?: string) => {
            imc.emit(type, payload, moduleName, target);
        },
        [moduleName]
    );

    const on = React.useCallback(
        (eventType: string, callback: (event: ModuleEvent) => void) => {
            imc.on(eventType, callback);
            return () => imc.off(eventType, callback);
        },
        []
    );

    const once = React.useCallback(
        (eventType: string, callback: (event: ModuleEvent) => void) => {
            imc.once(eventType, callback);
        },
        []
    );

    return {
        emit,
        on,
        once,
        // Méthodes utilitaires
        navigateToModule: (targetModule: string, route: string, params?: any) =>
            imc.navigateToModule(targetModule, route, params),
        shareUserData: (userData: any) => imc.shareUserData(userData, moduleName),
        showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') =>
            imc.showNotification(message, type, moduleName),
        updateAuthState: (isAuthenticated: boolean, user: any) =>
            imc.updateAuthState(isAuthenticated, user, moduleName),
        updateSharedData: (key: string, data: any) => imc.updateSharedData(key, data, moduleName),
    };
}

// Export de l'instance singleton
export const imc = InterModuleCommunication.getInstance();
export default InterModuleCommunication;
