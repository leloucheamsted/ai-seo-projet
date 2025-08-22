import { useState, useCallback } from 'react';

interface UseLoadingState {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    executeWithLoading: <T>(asyncFunction: () => Promise<T>) => Promise<T>;
}

/**
 * Hook personnalisé pour gérer l'état de chargement d'un composant
 * Simplifie l'utilisation du LoadingButton
 */
export const useLoadingState = (initialState: boolean = false): UseLoadingState => {
    const [isLoading, setIsLoading] = useState<boolean>(initialState);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    /**
     * Exécute une fonction asynchrone et gère automatiquement l'état de chargement
     * @param asyncFunction - Fonction asynchrone à exécuter
     * @returns Promise avec le résultat de la fonction
     */
    const executeWithLoading = useCallback(async <T>(asyncFunction: () => Promise<T>): Promise<T> => {
        try {
            setIsLoading(true);
            const result = await asyncFunction();
            return result;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        startLoading,
        stopLoading,
        executeWithLoading,
    };
};

/**
 * Hook pour gérer plusieurs états de chargement simultanés
 * Utile quand vous avez plusieurs boutons avec des tâches différentes
 */
export const useMultipleLoadingStates = <T extends string>(
    keys: readonly T[]
): Record<T, UseLoadingState> => {
    const loadingStates = {} as Record<T, UseLoadingState>;

    keys.forEach((key) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        loadingStates[key] = useLoadingState();
    });

    return loadingStates;
};
